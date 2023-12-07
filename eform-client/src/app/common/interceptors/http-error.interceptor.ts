import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {RetryConfig, Observable, retry, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AuthStateService} from 'src/app/common/store';
import {Injectable} from '@angular/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private authStateService: AuthStateService
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
    const retryConfig: RetryConfig = { count, delay };

    // Return the next handler, with retry logic applied
    return next.handle(request).pipe(
      // Retry on HTTP 504 errors up to the maximum number of retries
      retry(retryConfig),
      // Handle 400 - Bad Request
      catchError((error) => {
        let errorMessage = '';
        if (error.status === 400) {
          let errors;
          if (error._body) {
            errors = error._body;
          } else {
            errors = error.error;
          }
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
        // Handle 401 — Unauthorized
        if (error.status === 401) {
          this.toastrService.warning('401 - Unauthorized');
          console.error('401 - Unauthorized');
          console.error(error);
          this.authStateService.logout();
          return throwError(() => errorMessage);
        } else if (error.status === 403) {
          //this.toastrService.warning('403 - Forbidden');
          // console.error('403 - Forbidden');
          // console.error(error);
          localStorage.removeItem('token');
          this.router.navigate(['/auth']).then();
          //this.router.navigate(['/']).then();
          return throwError(() => errorMessage);
        }
        const body = error._body || '';
        // console.error(errorMessage);
        if (error.status !== undefined) {
          errorMessage = `${error.status} - ${error.statusText || ''} ${body}`;
          this.toastrService.error(errorMessage, 'Error', {
            timeOut: 10000,
          });
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
