/* eslint-disable no-console */
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse,
} from '@angular/common/http';
import {
  RetryConfig,
  Observable,
  retry,
  throwError,
  catchError,
  switchMap,
  timer, EMPTY
} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {AuthStateService} from 'src/app/common/store';
import { Injectable, inject } from '@angular/core';
import {AuthMethods, LoaderService} from 'src/app/common/services';
import {AuthResponseModel, OperationDataResult} from 'src/app/common/models';
import * as Sentry from '@sentry/angular';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../environments/environment';

/**
 * Statuses that are expected noise rather than bugs: 0 (network down / request aborted),
 * 401 and 403 (expired session, token refresh, missing permission).
 */
const SENTRY_IGNORED_STATUSES: readonly number[] = [0, 401, 403];

/** Exact-path match (query/fragment/trailing slash ignored), so sibling paths never match. */
function isDelegatedSignInUrl(url: string): boolean {
  let path: string;
  try {
    path = new URL(url, 'http://localhost').pathname.replace(/\/+$/, '');
  } catch {
    // An unparseable URL is simply not the delegated endpoint; the normal error handling proceeds.
    return false;
  }
  return path === `/${AuthMethods.Delegated}`;
}

/** The anonymous password checks the backend's login brake answers with 429 (LoginRateLimit). */
const LOGIN_RATE_LIMITED_PATHS: readonly string[] = ['/api/auth/token', '/api/auth/google-auth-key'];

/** Exact-path match (query/fragment/trailing slash and case ignored). */
export function isLoginRateLimitedUrl(url: string): boolean {
  let path: string;
  try {
    path = new URL(url, 'http://localhost').pathname.replace(/\/+$/, '').toLowerCase();
  } catch {
    return false;
  }
  return LOGIN_RATE_LIMITED_PATHS.includes(path);
}

/** Seconds to wait from a Retry-After header (delta-seconds or an HTTP date); 60 when absent or unreadable. */
export function retryAfterSeconds(retryAfter: string | null | undefined, now = Date.now()): number {
  const value = (retryAfter ?? '').trim();
  if (/^\d+$/.test(value)) {
    return Math.max(1, parseInt(value, 10));
  }
  const date = Date.parse(value);
  return isNaN(date) ? 60 : Math.max(1, Math.ceil((date - now) / 1000));
}

/** Methods that change nothing on the server, so sending them again is harmless. */
const READ_METHODS: readonly string[] = ['GET', 'HEAD', 'OPTIONS'];

/** Statuses that say the server (or the way to it) was briefly unavailable, not that the request was wrong. */
const TRANSIENT_STATUSES: readonly number[] = [0, 502, 503, 504];

const READ_MAX_RETRIES = 5;
const READ_RETRY_DELAY_MS = 15000;

const NO_ANSWER_MESSAGE = 'The server did not answer. Check whether the change was saved before trying again.';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private loaderService = inject(LoaderService);
  private toastrService = inject(ToastrService);
  private authStateService = inject(AuthStateService);
  private translateService = inject(TranslateService);


  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // A delegated sign-in assertion is single-use: a failure must reach the landing page
        // untouched - no logout, no refresh, no automatic retry.
        if (isDelegatedSignInUrl(request.url)) {
          return throwError(() => error);
        }
        // The login brake: tell the user how long to wait. Never replay the request (each replay would be
        // rejected again, or count as another attempt), and let the caller see the error so its spinner stops.
        if (error.status === 429 && isLoginRateLimitedUrl(request.url)) {
          this.loaderService.setLoading(false);
          const seconds = retryAfterSeconds(error.headers?.get('Retry-After'));
          this.toastrService.error(
            this.translateService.instant('Too many failed sign-in attempts. Try again in {{seconds}} seconds.', {seconds}),
            this.translateService.instant('Too many failed sign-ins'),
            {timeOut: 10000},
          );
          return throwError(() => error);
        }
        const errorMessage = '';
        if (environment.enableSentry && !SENTRY_IGNORED_STATUSES.includes(error.status)) {
          Sentry.captureException(error); // Log to Sentry only if enabled
        }
        switch (error.status) {
          case 400: {
            let errors;
            // @ts-ignore
            errors = error._body || error.error;
            if (errors && errors.length > 0) {
              errors.forEach((errorItem) => {
                this.toastrService.error(errorItem.errorMessage, 'Error', {
                  timeOut: 10000,
                });
                console.error(errorItem);
              });
            }
            return throwError(() => errorMessage);
          }
          case 401: { // Handle 401 — Unauthorized
            // console.error('401 - Unauthorized');
            // console.error(error);
            this.loaderService.setLoading(false);
            this.authStateService.logout();
            // return throwError(() => errorMessage);
            return EMPTY;
          }
          case 403: { // Handle 403 — Forbidden
            //this.toastrService.warning('403 - Forbidden');
            // console.error('403 - Forbidden');
            // console.error(error);
            // Try refresh token
            if(!request.url.includes(AuthMethods.RefreshToken)) {
              // this.authStore.dispatch(refreshToken());
              return this.authStateService.refreshToken().pipe(
                // This catchError must stay UPSTREAM of the switchMap below so that it only
                // reacts to a failing token refresh. Downstream it would also catch the error
                // of the retried request, so a genuine permission denial (a 403 that no fresh
                // token can fix) would sign the user out.
                catchError((refreshError) => {
                  // if refresh token is failed - logout
                  // console.error('Token refresh failed', refreshError);
                  this.loaderService.setLoading(false);
                  this.authStateService.logout();
                  // stop the request
                  return EMPTY;
                }),
                switchMap((response: OperationDataResult<AuthResponseModel>) => {
                  if (!response || !response.success || !response.model) {
                    // the refresh did not yield a usable token - the session is dead
                    this.loaderService.setLoading(false);
                    this.authStateService.logout();
                    return EMPTY;
                  }
                  // if refresh token success, update token in request and retry request
                  let newReq = null;
                  if(request.headers.has('Authorization')) {
                    const headers = request.headers.set('Authorization', `Bearer ${response.model.accessToken}`);
                    newReq = request.clone({ headers: headers });
                  }
                  // A 403 from this retry is a real permission denial: it propagates to the
                  // caller untouched instead of tearing down the session.
                  return next.handle(newReq || request);
                })
              );
            } else {
              this.loaderService.setLoading(false);
              this.authStateService.logout();
            }
            return EMPTY;
            // return throwError(() => errorMessage);
          }
          default: {
            // A failed write is never sent again automatically: its answer may simply have been lost
            // (pod restart, proxy, network) after the server already carried it out, and a replay would
            // create the record twice. The caller gets the error so its spinner stops and Save re-enables.
            // The loader is LoaderInterceptor's: it counts pending requests, so none is turned off here.
            if (!READ_METHODS.includes(request.method.toUpperCase())) {
              const message = error.status === 0
                ? this.translateService.instant(NO_ANSWER_MESSAGE)
                : `${error.status} - ${error.statusText || ''}`;
              this.toastrService.error(message, 'Error', {timeOut: 10000});
              return throwError(() => error);
            }
            // A read is retried while the server is briefly unavailable, one request at a time and
            // READ_RETRY_DELAY_MS apart; any other failure, or running out of retries, ends it quietly.
            const waitBeforeRetry = (err: HttpErrorResponse): Observable<unknown> => {
              if (!TRANSIENT_STATUSES.includes(err.status)) {
                return throwError(() => err);
              }
              this.loaderService.setLoading(true);
              console.log('Retrying request...');
              return timer(READ_RETRY_DELAY_MS);
            };
            // The failure in hand is the first attempt, so only READ_MAX_RETRIES - 1 remain after the wait.
            // catchError ends every way out quietly, as before: a non-transient first error (whose
            // throwError from waitBeforeRetry lands here too), a non-transient error during a retry, or
            // running out of retries. The loader shown during a wait is cleared by LoaderInterceptor
            // when the next attempt ends.
            return waitBeforeRetry(error).pipe(
              switchMap(() => next.handle(request).pipe(
                retry({count: READ_MAX_RETRIES - 1, delay: waitBeforeRetry}),
              )),
              catchError(() => EMPTY),
            );
          }
        }
      })
    );
  }
}

export class MyRetryConfig implements RetryConfig {
  count: number;
  delay: number;
  resetOnSuccess: boolean;
}
