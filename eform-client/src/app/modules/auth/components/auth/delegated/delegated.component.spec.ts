import {describe, it, expect, beforeEach, vi} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {of, throwError} from 'rxjs';
import {DelegatedComponent} from './delegated.component';
import {AuthService} from 'src/app/common/services';
import {AuthStateService} from 'src/app/common/store';
import {provideMockStore} from '@ngrx/store/testing';
import {selectAuthIsAuth} from 'src/app/state/auth/auth.selector';
import {captureDelegatedAssertion, resetDelegatedAssertion} from '../../../delegated-assertion';
import {DELEGATED_STATE_STORAGE_KEY} from '../../../delegated-state';

describe('DelegatedComponent', () => {
  const token = {accessToken: 'tok', tokenType: 'bearer', role: 'admin'};
  let authService: {loginDelegated: ReturnType<typeof vi.fn>};
  let authState: {completeLogin: ReturnType<typeof vi.fn>};

  /** An assertion carrying `state`, shaped like the portal's but unsigned: the route never verifies it. */
  function assertionWithState(state: string): string {
    const b64url = (text: string) =>
      btoa(String.fromCharCode(...new TextEncoder().encode(text)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    return `${b64url('{"alg":"RS256"}')}.${b64url(JSON.stringify({sub: 'advisor-77', state}))}.sig`;
  }

  /** Mirrors main.ts: the fragment is captured before the app (and Sentry) start. */
  function create(url: string, isAuth = false) {
    window.history.replaceState(null, '', url);
    captureDelegatedAssertion();
    // Reset explicitly: one test below builds the component twice, to prove a spent state
    // cannot be reused, and the builder only auto-resets between tests.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DelegatedComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideMockStore({selectors: [{selector: selectAuthIsAuth, value: isAuth}]}),
        {provide: AuthService, useValue: authService},
        {provide: AuthStateService, useValue: authState},
      ],
    });
    const fixture = TestBed.createComponent(DelegatedComponent);
    fixture.detectChanges();
    return fixture;
  }

  /** The state the start route would have left on this origin before the portal hop. */
  function seedState(state: string) {
    sessionStorage.setItem(DELEGATED_STATE_STORAGE_KEY, state);
  }

  beforeEach(() => {
    resetDelegatedAssertion();
    sessionStorage.clear();
    authService = {loginDelegated: vi.fn().mockReturnValue(of(token))};
    authState = {completeLogin: vi.fn()};
  });

  it('stores the returned token through the auth-state path on success', () => {
    seedState('nonce-1');
    const assertion = assertionWithState('nonce-1');
    create(`/auth/delegated#assertion=${assertion}`);
    expect(authService.loginDelegated).toHaveBeenCalledWith(assertion);
    expect(authState.completeLogin).toHaveBeenCalledWith(token);
  });

  it('shows a mapped message and does not sign in when the endpoint returns 401', () => {
    seedState('nonce-1');
    authService.loginDelegated.mockReturnValue(
      throwError(() => new HttpErrorResponse({status: 401, error: {message: 'DelegatedSignInRefused'}})));
    const fixture = create(`/auth/delegated#assertion=${assertionWithState('nonce-1')}`);
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(authState.completeLogin).not.toHaveBeenCalled();
    expect(authService.loginDelegated).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in refused');
    expect(text).not.toContain('DelegatedSignInRefused');
  });

  it('ignores the query string', () => {
    seedState('nonce-1');
    const fixture = create('/auth/delegated?assertion=from-query');
    expect(authService.loginDelegated).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in missing assertion');
  });

  it('shows the missing-assertion message on direct navigation with no fragment', () => {
    seedState('nonce-1');
    const fixture = create('/auth/delegated');
    expect(authService.loginDelegated).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in missing assertion');
  });

  it('refuses to replace an already-authenticated session', () => {
    seedState('nonce-1');
    const fixture = create(`/auth/delegated#assertion=${assertionWithState('nonce-1')}`, true);
    expect(authService.loginDelegated).not.toHaveBeenCalled();
    expect(authState.completeLogin).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in session exists');
  });

  it('delegated route refuses when the assertion\'s state does not match the stored one', () => {
    seedState('nonce-1');
    const fixture = create(`/auth/delegated#assertion=${assertionWithState('nonce-attacker')}`);
    expect(authService.loginDelegated).not.toHaveBeenCalled();
    expect(authState.completeLogin).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in refused');
  });

  it('delegated route refuses when no state is stored at all', () => {
    // THE login-CSRF case: a link carrying an attacker's assertion arrives at a browser that
    // never started a sign-in here, so it holds no state. Nothing is posted.
    const fixture = create(`/auth/delegated#assertion=${assertionWithState('nonce-attacker')}`);
    expect(sessionStorage.getItem(DELEGATED_STATE_STORAGE_KEY)).toBeNull();
    expect(authService.loginDelegated).not.toHaveBeenCalled();
    expect(authState.completeLogin).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in refused');
  });

  it('refuses an assertion that carries no state claim at all', () => {
    seedState('nonce-1');
    const fixture = create('/auth/delegated#assertion=jwt.abc.def');
    expect(authService.loginDelegated).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in refused');
  });

  it('delegated route clears the stored state after one use', () => {
    seedState('nonce-1');
    create(`/auth/delegated#assertion=${assertionWithState('nonce-1')}`);
    expect(authState.completeLogin).toHaveBeenCalledWith(token);
    expect(sessionStorage.getItem(DELEGATED_STATE_STORAGE_KEY)).toBeNull();
  });

  it('clears the stored state on every refusal path, so a second attempt cannot reuse it', () => {
    seedState('nonce-1');
    create(`/auth/delegated#assertion=${assertionWithState('nonce-attacker')}`);
    expect(sessionStorage.getItem(DELEGATED_STATE_STORAGE_KEY)).toBeNull();

    resetDelegatedAssertion();
    const second = create(`/auth/delegated#assertion=${assertionWithState('nonce-1')}`);
    expect(authService.loginDelegated).not.toHaveBeenCalled();
    expect(second.componentInstance.errorKey).toBe('Delegated sign-in refused');
  });
});
