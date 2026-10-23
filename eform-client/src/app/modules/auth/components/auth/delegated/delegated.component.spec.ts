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

describe('DelegatedComponent', () => {
  const token = {accessToken: 'tok', tokenType: 'bearer', role: 'admin'};
  let authService: {loginDelegated: ReturnType<typeof vi.fn>};
  let authState: {completeLogin: ReturnType<typeof vi.fn>};

  /** Mirrors main.ts: the fragment is captured before the app (and Sentry) start. */
  function create(url: string, isAuth = false) {
    window.history.replaceState(null, '', url);
    captureDelegatedAssertion();
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

  beforeEach(() => {
    resetDelegatedAssertion();
    authService = {loginDelegated: vi.fn().mockReturnValue(of(token))};
    authState = {completeLogin: vi.fn()};
  });

  it('stores the returned token through the auth-state path on success', () => {
    create('/auth/delegated#assertion=jwt.abc.def');
    expect(authService.loginDelegated).toHaveBeenCalledWith('jwt.abc.def');
    expect(authState.completeLogin).toHaveBeenCalledWith(token);
  });

  it('shows a mapped message and does not sign in when the endpoint returns 401', () => {
    authService.loginDelegated.mockReturnValue(
      throwError(() => new HttpErrorResponse({status: 401, error: {message: 'DelegatedSignInRefused'}})));
    const fixture = create('/auth/delegated#assertion=spent');
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(authState.completeLogin).not.toHaveBeenCalled();
    expect(authService.loginDelegated).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in refused');
    expect(text).not.toContain('DelegatedSignInRefused');
  });

  it('ignores the query string', () => {
    const fixture = create('/auth/delegated?assertion=from-query');
    expect(authService.loginDelegated).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in missing assertion');
  });

  it('shows the missing-assertion message on direct navigation with no fragment', () => {
    const fixture = create('/auth/delegated');
    expect(authService.loginDelegated).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in missing assertion');
  });

  it('refuses to replace an already-authenticated session', () => {
    const fixture = create('/auth/delegated#assertion=jwt.abc.def', true);
    expect(authService.loginDelegated).not.toHaveBeenCalled();
    expect(authState.completeLogin).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in session exists');
  });
});
