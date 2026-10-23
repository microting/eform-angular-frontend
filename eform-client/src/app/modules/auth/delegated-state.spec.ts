import {describe, it, expect, beforeEach} from 'vitest';
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
