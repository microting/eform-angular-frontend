import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import {TestBed} from '@angular/core/testing';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {HttpErrorInterceptor} from './http-error.interceptor';
import {AuthStateService} from 'src/app/common/store';
import {LoaderService} from 'src/app/common/services';
import * as Sentry from '@sentry/angular';
import {environment} from 'src/environments/environment';

vi.mock('@sentry/angular', () => ({captureException: vi.fn()}));

/**
 * Hand-rolled HttpHandler: every call to handle() shifts one scripted outcome off the
 * queue, so a test can script "first attempt 403, retry 403" precisely.
 */
class ScriptedHandler implements HttpHandler {
  readonly requests: HttpRequest<any>[] = [];

  constructor(private outcomes: Array<() => Observable<HttpEvent<any>>>) {}

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    this.requests.push(req);
    const outcome = this.outcomes.shift();
    if (!outcome) {
      throw new Error(`Unexpected extra request to ${req.url}`);
    }
    return outcome();
  }
}

const httpError = (status: number, url: string) =>
  throwError(() => new HttpErrorResponse({status, statusText: 'Error', url}));

const okResponse = (body: any = {ok: true}) =>
  of(new HttpResponse({status: 200, body}) as HttpEvent<any>);

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let authStateService: {refreshToken: Mock; logout: Mock};
  let loaderService: {setLoading: Mock};
  let toastrService: {error: Mock; warning: Mock};

  const url = '/api/templates/index';
  const request = new HttpRequest('GET', url, {
    headers: new HttpHeaders({Authorization: 'Bearer old-token'}),
  });

  // Sentry is off in the default (dev) environment; switch it on so the reporting rules run.
  // The environment file is bundled with the spec by the Angular test builder, so it cannot be
  // replaced with vi.mock; flip the flag on the shared object instead and restore it afterwards.
  const sentryWasEnabled = environment.enableSentry;
  afterEach(() => {
    environment.enableSentry = sentryWasEnabled;
  });

  beforeEach(() => {
    environment.enableSentry = true;
    (Sentry.captureException as Mock).mockClear();
    authStateService = {
      refreshToken: vi.fn(),
      logout: vi.fn(),
    };
    loaderService = {setLoading: vi.fn()};
    toastrService = {error: vi.fn(), warning: vi.fn()};

    TestBed.configureTestingModule({
      providers: [
        HttpErrorInterceptor,
        {provide: AuthStateService, useValue: authStateService},
        {provide: LoaderService, useValue: loaderService},
        {provide: ToastrService, useValue: toastrService},
      ],
    });

    interceptor = TestBed.inject(HttpErrorInterceptor);
  });

  it('keeps the session when the token refresh succeeds but the retried request is still 403', () => {
    authStateService.refreshToken.mockReturnValue(
      of({success: true, model: {accessToken: 'new-token'}})
    );
    const handler = new ScriptedHandler([
      () => httpError(403, url),
      () => httpError(403, url),
    ]);

    let receivedError: HttpErrorResponse | null = null;
    let completedWithoutError = false;
    interceptor.intercept(request, handler).subscribe({
      next: () => {},
      error: (error) => (receivedError = error),
      complete: () => (completedWithoutError = receivedError === null),
    });

    expect(handler.requests.length).toBe(2);
    expect(authStateService.logout).not.toHaveBeenCalled();
    expect(receivedError).toBeInstanceOf(HttpErrorResponse);
    expect(receivedError!.status).toBe(403);
    expect(completedWithoutError).toBe(false);
  });

  it('delivers the response when the retry succeeds after a token refresh', () => {
    authStateService.refreshToken.mockReturnValue(
      of({success: true, model: {accessToken: 'new-token'}})
    );
    const handler = new ScriptedHandler([
      () => httpError(403, url),
      () => okResponse({templates: []}),
    ]);

    let receivedEvent: HttpEvent<any> | null = null;
    let receivedError: any = null;
    interceptor.intercept(request, handler).subscribe({
      next: (event) => (receivedEvent = event),
      error: (error) => (receivedError = error),
    });

    expect(receivedError).toBeNull();
    expect(receivedEvent).toBeInstanceOf(HttpResponse);
    expect((receivedEvent as unknown as HttpResponse<any>).body).toEqual({templates: []});
    expect(authStateService.logout).not.toHaveBeenCalled();
    // the retry must carry the refreshed bearer token
    expect(handler.requests[1].headers.get('Authorization')).toBe('Bearer new-token');
  });

  it('logs out when the token refresh itself fails', () => {
    authStateService.refreshToken.mockReturnValue(
      throwError(() => new Error('refresh failed'))
    );
    const handler = new ScriptedHandler([() => httpError(403, url)]);

    interceptor.intercept(request, handler).subscribe({
      next: () => {},
      error: () => {},
    });

    expect(authStateService.logout).toHaveBeenCalledTimes(1);
    expect(handler.requests.length).toBe(1);
  });

  it('logs out when the token refresh returns an unsuccessful result', () => {
    authStateService.refreshToken.mockReturnValue(of({success: false, model: null}));
    const handler = new ScriptedHandler([() => httpError(403, url)]);

    interceptor.intercept(request, handler).subscribe({
      next: () => {},
      error: () => {},
    });

    expect(authStateService.logout).toHaveBeenCalledTimes(1);
    expect(handler.requests.length).toBe(1);
  });

  it('does not refresh or log out on a non-403 error', () => {
    const handler = new ScriptedHandler([
      () => httpError(500, url),
      () => okResponse(),
    ]);

    interceptor.intercept(request, handler).subscribe({
      next: () => {},
      error: () => {},
    });

    expect(authStateService.refreshToken).not.toHaveBeenCalled();
    expect(authStateService.logout).not.toHaveBeenCalled();
  });

  describe('Sentry reporting', () => {
    const run = (handler: ScriptedHandler) =>
      interceptor.intercept(request, handler).subscribe({next: () => {}, error: () => {}});

    it.each([
      ['network failure / aborted request', 0],
      ['unauthorized', 401],
    ])('does not report a %s (%i)', (_name, status) => {
      run(new ScriptedHandler([() => httpError(status, url), () => okResponse()]));

      expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('does not report a forbidden response (403)', () => {
      authStateService.refreshToken.mockReturnValue(
        of({success: true, model: {accessToken: 'new-token'}})
      );

      run(new ScriptedHandler([() => httpError(403, url), () => okResponse()]));

      expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it.each([400, 404, 500])('reports a %i response', (status) => {
      run(new ScriptedHandler([() => httpError(status, url), () => okResponse()]));

      expect(Sentry.captureException).toHaveBeenCalledTimes(1);
      const reported = (Sentry.captureException as Mock).mock.calls[0][0];
      expect(reported).toBeInstanceOf(HttpErrorResponse);
      expect(reported.status).toBe(status);
    });
  });

  it.each([401, 500])('passes a %i from the delegated sign-in through: no logout, no retry', (status) => {
    const delegatedUrl = '/api/auth/delegated';
    const handler = new ScriptedHandler([() => httpError(status, delegatedUrl), () => okResponse()]);
    let receivedError: HttpErrorResponse | null = null;
    interceptor.intercept(new HttpRequest('POST', delegatedUrl, {assertion: 'x'}), handler).subscribe({
      error: (error) => (receivedError = error),
    });

    expect(handler.requests.length).toBe(1);
    expect(authStateService.logout).not.toHaveBeenCalled();
    expect(receivedError!.status).toBe(status);
  });
});
