/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/common/store';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private authStateService: AuthStateService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        let errorMessage = '';
        // Handle 400 - Bad Request
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
          return throwError(error);
        }
        // Handle 401 — Unauthorized
        if (error.status === 401) {
          this.toastrService.warning('401 - Unauthorized');
          console.error('401 - Unauthorized');
          console.error(error);
          this.authStateService.logout();
          return throwError(errorMessage);
        } else if (error.status === 403) {
          this.toastrService.warning('403 - Forbidden');
          console.error('403 - Forbidden');
          console.error(error);
          this.router.navigate(['/']).then();
          return throwError(errorMessage);
        }
        const body = error._body || '';
        errorMessage = `${error.status} - ${error.statusText || ''} ${body}`;
        console.error(errorMessage);
        this.toastrService.error(errorMessage, 'Error', { timeOut: 10000 });
        return throwError(errorMessage);
      })
    );
  }
}
