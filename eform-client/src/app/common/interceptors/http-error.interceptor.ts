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
  switchMap
} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AuthStateService} from 'src/app/common/store';
import {Injectable} from '@angular/core';
import {AuthMethods} from 'src/app/common/services';
import {AuthResponseModel, OperationDataResult} from 'src/app/common/models';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private authStateService: AuthStateService,
  ) {
    // console.log('HttpErrorInterceptor - constructor');
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log('HttpErrorInterceptor - intercept');
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
            console.error('401 - Unauthorized');
            console.error(error);
            this.authStateService.logout();
            return throwError(() => errorMessage);
          }
          case 403: { // Handle 403 — Forbidden
            //this.toastrService.warning('403 - Forbidden');
            console.error('403 - Forbidden');
            console.error(error);
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
                  console.error('Token refresh failed', refreshError);
                  this.authStateService.logout();
                  return throwError(() => errorMessage);
                })
              );
            } else {
              this.authStateService.logout();
            }
            return throwError(() => errorMessage);
          }
          default: {
            // @ts-ignore
            const body = error._body || '';
            errorMessage = `${error.status} - ${error.statusText || ''} ${body}`;
            this.toastrService.error(errorMessage, 'Error', {
              timeOut: 10000,
            });
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
