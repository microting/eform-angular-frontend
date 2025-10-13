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
  timer, retryWhen, EMPTY
} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {AuthStateService} from 'src/app/common/store';
import { Injectable, inject } from '@angular/core';
import {AuthMethods, LoaderService} from 'src/app/common/services';
import {AuthResponseModel, OperationDataResult} from 'src/app/common/models';
import * as Sentry from '@sentry/angular';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private loaderService = inject(LoaderService);
  private toastrService = inject(ToastrService);
  private authStateService = inject(AuthStateService);


  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Define a maximum number of retries and a delay between each retry
    const count = 0;
    const delay = 15000; // 10 seconds in milliseconds
    const retryConfig: RetryConfig = {count, delay};

    // Return the next handler, with retry logic applied
    return next.handle(request).pipe(
      // Retry on HTTP 504 errors up to the maximum number of retries
      retry(retryConfig),
      // Handle 400 - Bad Request
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        Sentry.captureException(error); // Log to Sentry
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
                switchMap((response: OperationDataResult<AuthResponseModel>) => {
                  // if refresh token success, update token in request and retry request
                  let newReq = null;
                  if(request.headers.has('Authorization')) {
                    const headers = request.headers.set('Authorization', `Bearer ${response.model.accessToken}`);
                    newReq = request.clone({ headers: headers });
                  }
                  return next.handle(newReq || request);
                }),
                catchError((refreshError) => {
                  // if refresh token is failed - logout
                  // console.error('Token refresh failed', refreshError);
                  this.loaderService.setLoading(false);
                  this.authStateService.logout();
                  // stop the request
                  return EMPTY;
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
            const maxRetries = 5; // Number of retries (x)
            const retryDelay = 15000; // Delay in milliseconds (y)

            // @ts-ignore
            if (error._body === undefined) {
              return next.handle(request).pipe(
                retryWhen((errors) =>
                  errors.pipe(
                    switchMap((err, index) => {
                      if (index < maxRetries) {
                        this.loaderService.setLoading(true);
                        console.log('Retrying request...');
                        return timer(retryDelay); // Wait for retryDelay before retrying
                      }
                      return EMPTY;
                      // return throwError(() => err); // Throw error after max retries
                    })
                  )
                )
              );
            }

            // @ts-ignore
            const body = error._body || '';
            errorMessage = `${error.status} - ${error.statusText || ''} ${body}`;
            if (errorMessage !== 'undefined -  ') {
              this.toastrService.error(errorMessage, 'Error', {
                timeOut: 10000,
              });
            }
            return EMPTY;
            // return throwError(() => errorMessage); // Ensure the error is propagated
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
