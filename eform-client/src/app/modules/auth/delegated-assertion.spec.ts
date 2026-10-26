import {describe, it, expect, beforeEach} from 'vitest';
import {
  captureDelegatedAssertion,
  resetDelegatedAssertion,
  scrubAssertion,
  scrubAssertionDeep,
  takeDelegatedAssertion,
} from './delegated-assertion';

describe('delegated-assertion', () => {
  beforeEach(() => resetDelegatedAssertion());

  it('removes the fragment from the URL before anything (Sentry) can observe it', () => {
    window.history.replaceState(null, '', '/auth/delegated?x=1#assertion=jwt.abc.def');
    captureDelegatedAssertion();
    expect(window.location.hash).toBe('');
    expect(window.location.href).not.toContain('#');
    expect(window.location.href).not.toContain('jwt.abc.def');
    expect(window.location.pathname + window.location.search).toBe('/auth/delegated?x=1');
  });

  it('hands the value over exactly once', () => {
    window.history.replaceState(null, '', '/auth/delegated#assertion=jwt.abc.def');
    captureDelegatedAssertion();
    expect(takeDelegatedAssertion()).toBe('jwt.abc.def');
    expect(takeDelegatedAssertion()).toBeNull();
  });

  it('leaves unrelated fragments alone', () => {
    window.history.replaceState(null, '', '/somewhere#section');
    captureDelegatedAssertion();
    expect(window.location.hash).toBe('#section');
    expect(takeDelegatedAssertion()).toBeNull();
  });

  it('scrubs the portal state from telemetry payloads too', () => {
    // The same bundle serves my.microting.com, whose authorize bridge page carries ?state= in
    // the address bar, and the buffered replay ships the URL bar on any error.
    expect(scrubAssertion('https://my.microting.com/plugins/my-microting-pn/delegated/authorize?customerNo=950&state=sekrit-nonce'))
      .toBe('https://my.microting.com/plugins/my-microting-pn/delegated/authorize?customerNo=950&state=[Filtered]');
    expect(scrubAssertion('/auth/delegated#assertion=abc.def&state=sekrit-nonce'))
      .toBe('/auth/delegated#assertion=[Filtered]&state=[Filtered]');
    const event = scrubAssertionDeep({
      request: {url: 'https://my.microting.com/x?state=sekrit-nonce'},
      crumbs: [{to: '/plugins/my-microting-pn/delegated/authorize?state=sekrit-nonce&customerNo=950'}],
    });
    expect(JSON.stringify(event)).not.toMatch(/sekrit-nonce/);
    // customerNo is not a secret and stays legible, so a scrubbed replay is still readable.
    expect(JSON.stringify(event)).toContain('customerNo=950');
  });

  it('scrubs assertions from telemetry payloads', () => {
    expect(scrubAssertion('https://t/auth/delegated#assertion=abc.def&a=1')).toBe('https://t/auth/delegated#assertion=[Filtered]&a=1');
    const event = scrubAssertionDeep({request: {url: 'https://t/auth/delegated#assertion=abc.def'}, crumbs: [{to: '/auth/delegated?assertion=zzz'}]});
    expect(JSON.stringify(event)).not.toMatch(/abc\.def|zzz/);
  });
});
