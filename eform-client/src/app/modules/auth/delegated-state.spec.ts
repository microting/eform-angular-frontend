import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {
  DELEGATED_STATE_STORAGE_KEY,
  PORTAL_AUTHORIZE_PATH,
  PORTAL_BASE_URL,
  delegatedAuthorizeUrl,
  generateDelegatedState,
  readAssertionState,
  storeDelegatedState,
  takeDelegatedState,
  tenantCustomerNo,
} from './delegated-state';

/** Builds an UNSIGNED token with the given payload: the reader must not care about the signature. */
function tokenWith(payload: unknown): string {
  const b64url = (text: string) =>
    btoa(String.fromCharCode(...new TextEncoder().encode(text)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  return `${b64url('{"alg":"RS256"}')}.${b64url(JSON.stringify(payload))}.sig`;
}

describe('delegated-state', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('generates a state the portal will accept: unreserved characters only, at most 128', () => {
    for (let i = 0; i < 50; i++) {
      const state = generateDelegatedState();
      expect(state).not.toBeNull();
      expect(state!.length).toBeGreaterThanOrEqual(32);
      expect(state!.length).toBeLessThanOrEqual(128);
      // RFC 3986 unreserved, exactly the set DelegatedAuthorizeService.IsAcceptableState allows.
      expect(state!).toMatch(/^[A-Za-z0-9\-._~]+$/);
    }
  });

  it('draws every byte of the state from crypto.getRandomValues, never Math.random', () => {
    // The ONE load-bearing property of the whole defence, and the one a well-meaning "add a
    // fallback for old browsers" refactor would quietly remove: a guessable state is not a
    // weaker version of this, it is the absence of it. The charset and uniqueness tests above
    // are both satisfied by Math.random, and even by a counter, so they cannot pin this.
    // Asserted two ways: the CSPRNG must be CALLED, and the output must be exactly what those
    // bytes map to, so no second source can be mixed in.
    const getRandomValues = vi.spyOn(crypto, 'getRandomValues').mockImplementation((buffer) => {
      const bytes = buffer as Uint8Array;
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = i;
      }
      return buffer;
    });

    const state = generateDelegatedState();

    expect(getRandomValues).toHaveBeenCalledTimes(1);
    const filled = getRandomValues.mock.calls[0][0] as Uint8Array;
    expect(filled).toBeInstanceOf(Uint8Array);
    expect(filled.length).toBe(32);
    // Bytes 0..31 against 'A-Z a-z 0-9 - _', in that order.
    expect(state).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef');
  });

  it('maps a random byte to a character without bias: 256 is an exact multiple of the alphabet', () => {
    // b and b+64 must land on the same character, which is only true if the alphabet is
    // exactly 64 symbols. Widening it to 65 would reintroduce modulo bias.
    const stateFor = (seed: number) => {
      vi.spyOn(crypto, 'getRandomValues').mockImplementation((buffer) => {
        const bytes = buffer as Uint8Array;
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = (seed + i * 64) % 256;
        }
        return buffer;
      });
      return generateDelegatedState();
    };

    const first = stateFor(7);
    expect(first).not.toBeNull();
    // Every fourth byte differs by 256, i.e. is the same byte, so the whole string is one
    // character repeated.
    expect(new Set(first!.split('')).size).toBe(1);
  });

  it('refuses to invent a state when the browser has no CSPRNG', () => {
    // The refusal branch: null, never a Math.random fallback. Removing the function rather
    // than stubbing it, because a stub is still a function and would take the happy path.
    const own = Object.getOwnPropertyDescriptor(crypto, 'getRandomValues');
    Object.defineProperty(crypto, 'getRandomValues', {value: undefined, configurable: true, writable: true});
    try {
      expect(generateDelegatedState()).toBeNull();
    } finally {
      if (own) {
        Object.defineProperty(crypto, 'getRandomValues', own);
      } else {
        delete (crypto as unknown as Record<string, unknown>)['getRandomValues'];
      }
    }
    expect(typeof crypto.getRandomValues).toBe('function');
  });

  it('never returns the same state twice', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      seen.add(generateDelegatedState()!);
    }
    expect(seen.size).toBe(200);
  });

  it('hands the stored state over exactly once and clears it', () => {
    expect(storeDelegatedState('abc')).toBe(true);
    expect(sessionStorage.getItem(DELEGATED_STATE_STORAGE_KEY)).toBe('abc');
    expect(takeDelegatedState()).toBe('abc');
    expect(takeDelegatedState()).toBeNull();
    expect(sessionStorage.getItem(DELEGATED_STATE_STORAGE_KEY)).toBeNull();
  });

  it('reads the customer number from the tenant hostname and refuses anything else', () => {
    expect(tenantCustomerNo('950.microting.com')).toBe('950');
    expect(tenantCustomerNo('3412.microting.com')).toBe('3412');
    expect(tenantCustomerNo('localhost')).toBeNull();
    expect(tenantCustomerNo('my.microting.com')).toBeNull();
    expect(tenantCustomerNo('0.microting.com')).toBeNull();
    expect(tenantCustomerNo('950a.microting.com')).toBeNull();
    expect(tenantCustomerNo('')).toBeNull();
    expect(tenantCustomerNo(null)).toBeNull();
  });

  it('builds the portal authorize URL the portal already reads', () => {
    expect(delegatedAuthorizeUrl('950', 'nonce-1')).toBe(
      `${PORTAL_BASE_URL}${PORTAL_AUTHORIZE_PATH}?customerNo=950&state=nonce-1`);
    expect(PORTAL_AUTHORIZE_PATH).toBe('/plugins/my-microting-pn/delegated/authorize');
  });

  it('reads the state claim out of an assertion payload', () => {
    expect(readAssertionState(tokenWith({sub: 'advisor-77', state: 'nonce-1'}))).toBe('nonce-1');
  });

  it('answers null for an assertion with no usable state claim', () => {
    expect(readAssertionState(null)).toBeNull();
    expect(readAssertionState('')).toBeNull();
    expect(readAssertionState('not-a-jwt')).toBeNull();
    expect(readAssertionState('a.b')).toBeNull();
    expect(readAssertionState('a.!!!not-base64!!!.c')).toBeNull();
    expect(readAssertionState(tokenWith({sub: 'advisor-77'}))).toBeNull();
    expect(readAssertionState(tokenWith({state: ''}))).toBeNull();
    expect(readAssertionState(tokenWith({state: 42}))).toBeNull();
  });
});
