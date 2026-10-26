import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {DelegatedStartComponent} from './delegated-start.component';
import {DELEGATED_STATE_STORAGE_KEY, PORTAL_AUTHORIZE_PATH, PORTAL_BASE_URL} from '../../../delegated-state';

describe('DelegatedStartComponent', () => {
  /**
   * Builds the component with the tenant hostname and the cross-origin navigation stubbed:
   * those are its only two contacts with the real browser.
   */
  function create(hostname: string, url = '/auth/delegated/start') {
    window.history.replaceState(null, '', url);
    TestBed.configureTestingModule({
      imports: [DelegatedStartComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(DelegatedStartComponent);
    const component = fixture.componentInstance as unknown as {
      tenantHostname: () => string;
      assignLocation: (url: string) => void;
    };
    vi.spyOn(component, 'tenantHostname').mockReturnValue(hostname);
    const assign = vi.spyOn(component, 'assignLocation').mockImplementation(() => undefined);
    fixture.detectChanges();
    return {fixture, assign};
  }

  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('start route generates a state, stores it, and redirects to the portal authorize URL', () => {
    const {fixture, assign} = create('950.microting.com');

    const stored = sessionStorage.getItem(DELEGATED_STATE_STORAGE_KEY);
    expect(stored).toMatch(/^[A-Za-z0-9\-._~]{32,128}$/);
    expect(assign).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith(
      `${PORTAL_BASE_URL}${PORTAL_AUTHORIZE_PATH}?customerNo=950&state=${stored}`);
    expect(fixture.componentInstance.errorKey).toBeNull();
  });

  it('start route takes the portal host from a constant and the customer number from the hostname, never from a query parameter', () => {
    // Every steerable value an attacker could hope for, all in the query string at once.
    const {assign} = create(
      '950.microting.com',
      '/auth/delegated/start?issuer=https://evil.example&customerNo=1043&state=attacker-state&redirect_uri=https://evil.example');

    const url = assign.mock.calls[0][0] as string;
    expect(url.startsWith(`${PORTAL_BASE_URL}${PORTAL_AUTHORIZE_PATH}?`)).toBe(true);
    expect(url).toContain('customerNo=950');
    expect(url).not.toContain('evil.example');
    expect(url).not.toContain('1043');
    expect(url).not.toContain('attacker-state');
    expect(sessionStorage.getItem(DELEGATED_STATE_STORAGE_KEY)).not.toBe('attacker-state');
  });

  it('start route refuses when the hostname has no numeric first label', () => {
    const {fixture, assign} = create('my.microting.com');

    expect(assign).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(DELEGATED_STATE_STORAGE_KEY)).toBeNull();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in unavailable');
  });

  it('start route refuses when the browser has no CSPRNG to draw a state from', () => {
    // Removing the function, not stubbing it: a stub is still a function and would take the
    // happy path. The real module is exercised, so this covers generateDelegatedState's null
    // branch end to end rather than a mock of it.
    const own = Object.getOwnPropertyDescriptor(crypto, 'getRandomValues');
    Object.defineProperty(crypto, 'getRandomValues', {value: undefined, configurable: true, writable: true});
    try {
      const {fixture, assign} = create('950.microting.com');

      expect(assign).not.toHaveBeenCalled();
      expect(sessionStorage.getItem(DELEGATED_STATE_STORAGE_KEY)).toBeNull();
      expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in unavailable');
    } finally {
      if (own) {
        Object.defineProperty(crypto, 'getRandomValues', own);
      } else {
        delete (crypto as unknown as Record<string, unknown>)['getRandomValues'];
      }
    }
  });

  it('start route refuses rather than leave without a state it can check on the way back', () => {
    // The instance, not Storage.prototype: happy-dom's sessionStorage carries its own
    // methods, so a prototype spy never fires.
    vi.spyOn(window.sessionStorage, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });

    const {fixture, assign} = create('950.microting.com');

    expect(assign).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in unavailable');
  });
});
