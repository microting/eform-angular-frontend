/**
 * The tenant's half of the delegated sign-in handshake: the `state` that makes the flow
 * TENANT-initiated.
 *
 * Without it the flow is IdP-initiated and open to login CSRF: anyone who can get a portal
 * assertion minted — for their OWN advisor account, on their OWN customer — could mail the
 * resulting link to a victim, and the victim's browser would quietly sign itself in as
 * somebody else. Every check on the assertion would pass, because the assertion is genuine;
 * what is missing is any evidence that THIS browser asked for it.
 *
 * So the browser asks first. `/auth/delegated/start` generates a value, keeps it in
 * sessionStorage on the tenant's own origin, and sends only its copy to the portal. The
 * portal echoes it into the assertion. `/auth/delegated` compares the two before it posts
 * anything. An attacker cannot read the victim's sessionStorage — it is another origin — so
 * they cannot produce an assertion that echoes it, and the refusal in that case is the whole
 * point of this file.
 */

/** Where the state lives between the two hops. sessionStorage, so a closed tab forgets it. */
export const DELEGATED_STATE_STORAGE_KEY = 'delegatedSignInState';

/**
 * The portal's origin, hardcoded.
 *
 * It MUST NOT come from a query parameter, a fragment or anything else the caller controls:
 * this value decides where the browser is sent, and a steerable one would hand an attacker
 * exactly the open redirect the portal side was careful not to build. There is no client
 * config endpoint carrying it, and a single hostname is the convention across this flow.
 */
export const PORTAL_BASE_URL = 'https://my.microting.com';

/**
 * The portal's bridge page. An Angular page, not an API path: the assertion is picked up
 * with the advisor's bearer token from browser storage, which a cross-origin navigation to
 * the API would not carry. Both the path and the two parameter names below are a wire
 * contract with the portal repository — it reads `customerNo` and `state` off this URL.
 */
export const PORTAL_AUTHORIZE_PATH = '/plugins/my-microting-pn/delegated/authorize';

/**
 * 64 characters, all of them in the RFC 3986 unreserved set the portal accepts
 * (`DelegatedAuthorizeService.IsAcceptableState`). 256 / 64 is exact, so reducing a random
 * byte modulo this alphabet introduces no bias.
 */
const STATE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/** 32 characters of a 64-symbol alphabet: 192 bits, and far inside the portal's cap of 128. */
const STATE_LENGTH = 32;

/**
 * A fresh state, or null when this browser has no CSPRNG.
 *
 * Null rather than a `Math.random` fallback on purpose: a guessable state is not a weaker
 * version of this defence, it is the absence of it, and a caller that cannot generate one
 * must refuse to start rather than start insecurely.
 */
export function generateDelegatedState(): string | null {
  const webCrypto = typeof crypto === 'undefined' ? undefined : crypto;
  if (!webCrypto || typeof webCrypto.getRandomValues !== 'function') {
    return null;
  }
  const bytes = new Uint8Array(STATE_LENGTH);
  webCrypto.getRandomValues(bytes);
  let state = '';
  for (const byte of bytes) {
    state += STATE_ALPHABET[byte % STATE_ALPHABET.length];
  }
  return state;
}

/**
 * Stores the state on this origin, and reports whether it is really there.
 *
 * sessionStorage throws in a browser with site data blocked, and a silently dropped write
 * would send the advisor to the portal with nothing to check on the way back — a round trip
 * that can only end in a refusal. The caller refuses up front instead.
 */
export function storeDelegatedState(state: string): boolean {
  try {
    sessionStorage.setItem(DELEGATED_STATE_STORAGE_KEY, state);
    return sessionStorage.getItem(DELEGATED_STATE_STORAGE_KEY) === state;
  } catch {
    return false;
  }
}

/**
 * One-shot read: returns the stored state and clears it.
 *
 * Always clears, including when there was nothing there and including on the way to a
 * refusal, so no attempt — successful, refused or abandoned — can leave a state behind for
 * a second one to spend.
 */
export function takeDelegatedState(): string | null {
  try {
    const state = sessionStorage.getItem(DELEGATED_STATE_STORAGE_KEY);
    sessionStorage.removeItem(DELEGATED_STATE_STORAGE_KEY);
    return state && state.length > 0 ? state : null;
  } catch {
    return null;
  }
}

/**
 * This tenant's customerNo, taken from the first label of its own hostname
 * (`950.microting.com` -> `950`), or null when the hostname is not a customer tenant's.
 *
 * The hostname and not a query parameter: it is server-controlled, and that is the whole
 * requirement. A parameter would let a caller name any customer, which is how an open
 * redirect gets built by accident. Digits only, and positive, exactly as the portal's own
 * bridge page parses it; a hostname whose first label is not a number is refused rather
 * than guessed at, because guessing here means sending the browser somewhere arbitrary.
 */
export function tenantCustomerNo(hostname: string | null | undefined): string | null {
  const firstLabel = (hostname ?? '').split('.')[0];
  if (!/^\d+$/.test(firstLabel) || Number(firstLabel) <= 0) {
    return null;
  }
  return firstLabel;
}

/** The portal URL the start route sends the browser to. */
export function delegatedAuthorizeUrl(customerNo: string, state: string): string {
  // Both values are already restricted to digits and the unreserved set, so the encoding is
  // a no-op; it is here so that stays true if either ever widens.
  return `${PORTAL_BASE_URL}${PORTAL_AUTHORIZE_PATH}`
    + `?customerNo=${encodeURIComponent(customerNo)}&state=${encodeURIComponent(state)}`;
}

/**
 * Reads the `state` claim out of an assertion's payload WITHOUT verifying its signature.
 *
 * Sound here, and only here, because this is a CSRF binding and not an authorisation
 * decision. The value read is compared against one THIS browser generated and kept on this
 * origin; an attacker cannot read it, so they cannot forge a payload that echoes it, and a
 * tampered payload can only ever turn a match into a mismatch — a refusal. Nothing is
 * granted on the strength of anything read here: the server still checks signature, issuer,
 * audience, algorithm, lifetime and replay before it signs anybody in.
 */
export function readAssertionState(assertion: string | null | undefined): string | null {
  if (!assertion) {
    return null;
  }
  const parts = assertion.split('.');
  if (parts.length !== 3) {
    return null;
  }
  try {
    const payload: unknown = JSON.parse(decodeBase64Url(parts[1]));
    const state = (payload as {state?: unknown} | null)?.state;
    return typeof state === 'string' && state.length > 0 ? state : null;
  } catch {
    return null;
  }
}

// Not `JwtHelper`/`jwt-decode`: this must answer null for arbitrary attacker-supplied input
// rather than throw, since reaching it at all is the refusal path.
function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
