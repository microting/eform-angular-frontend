/**
 * Holds the delegated sign-in assertion received in the URL fragment.
 *
 * The assertion is a credential-equivalent bearer token. Client-side telemetry (Sentry
 * tracing and Session Replay) records the URL bar, so the fragment must be taken out of the
 * URL BEFORE Sentry.init runs. main.ts calls captureDelegatedAssertion() first thing; the
 * landing component later reads the in-memory value with takeDelegatedAssertion().
 */
let pendingAssertion: string | null = null;

const ASSERTION_IN_URL = /([#&?]assertion=)[^&#\s"']*/gi;

/** Reads `#assertion=` from the fragment, stores it in memory and strips the fragment. */
export function captureDelegatedAssertion(win: Window | undefined = typeof window === 'undefined' ? undefined : window): void {
  if (!win) {
    return;
  }
  const hash = win.location.hash;
  if (!hash) {
    return;
  }
  const value = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash).get('assertion');
  if (value !== null) {
    pendingAssertion = value;
    // replaceState drops the fragment entirely (no stray '#', no extra history entry).
    win.history.replaceState(win.history.state, '', win.location.pathname + win.location.search);
  }
}

/** One-shot read: returns the captured assertion and forgets it. */
export function takeDelegatedAssertion(): string | null {
  const value = pendingAssertion;
  pendingAssertion = null;
  return value;
}

/** Redacts any `assertion=` value in a string (URLs in telemetry payloads). */
export function scrubAssertion(text: string): string {
  return text.replace(ASSERTION_IN_URL, '$1[Filtered]');
}

/** Deep-scrubs a telemetry event/breadcrumb without mutating its shape. */
export function scrubAssertionDeep<T>(payload: T): T {
  try {
    return JSON.parse(scrubAssertion(JSON.stringify(payload))) as T;
  } catch {
    return payload;
  }
}

/** Test helper. */
export function resetDelegatedAssertion(): void {
  pendingAssertion = null;
}
