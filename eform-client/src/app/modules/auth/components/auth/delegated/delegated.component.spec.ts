import {describe, it, expect, beforeEach, vi} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {of, throwError} from 'rxjs';
import {DelegatedComponent} from './delegated.component';
import {AuthService} from 'src/app/common/services';
import {AuthStateService} from 'src/app/common/store';

describe('DelegatedComponent', () => {
  const token = {accessToken: 'tok', tokenType: 'bearer', role: 'admin'};
  let authService: {loginDelegated: ReturnType<typeof vi.fn>};
  let authState: {completeLogin: ReturnType<typeof vi.fn>};

  function create(url: string) {
    window.history.replaceState(null, '', url);
    TestBed.configureTestingModule({
      imports: [DelegatedComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {provide: AuthService, useValue: authService},
        {provide: AuthStateService, useValue: authState},
      ],
    });
    const fixture = TestBed.createComponent(DelegatedComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    authService = {loginDelegated: vi.fn().mockReturnValue(of(token))};
    authState = {completeLogin: vi.fn()};
  });

  it('stores the returned token through the auth-state path on success', () => {
    create('/auth/delegated#assertion=jwt.abc.def');
    expect(authService.loginDelegated).toHaveBeenCalledWith('jwt.abc.def');
    expect(authState.completeLogin).toHaveBeenCalledWith(token);
  });

  it('wipes the fragment from the address bar before the HTTP call', () => {
    let hashAtCall: string | null = null;
    authService.loginDelegated.mockImplementation(() => {
      hashAtCall = window.location.hash;
      return of(token);
    });
    create('/auth/delegated#assertion=jwt.abc.def');
    expect(hashAtCall).toBe('');
    expect(window.location.href).not.toContain('#');
    expect(window.location.href).not.toContain('jwt.abc.def');
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

  it('reads the assertion from the fragment, never from the query string', () => {
    const fixture = create('/auth/delegated?assertion=from-query');
    expect(authService.loginDelegated).not.toHaveBeenCalled();
    expect(authState.completeLogin).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errorKey).toBe('Delegated sign-in missing assertion');
  });
});
