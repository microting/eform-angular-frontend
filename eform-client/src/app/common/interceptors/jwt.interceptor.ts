import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {Observable, of, take} from 'rxjs';
import { AuthStateService } from 'src/app/common/store';
import {Store} from '@ngrx/store';
import {map, switchMap} from 'rxjs/operators';
import {selectAuthIsAuth, selectBearerToken} from 'src/app/state/auth/auth.selector';

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//   constructor(private authStateService: AuthStateService) {}
//
//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     if (this.authStateService.isAuth) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: this.authStateService.bearerToken,
//         },
//       });
//     }
//
//     return next.handle(request);
//   }
// }
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private store = inject(Store);


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(selectAuthIsAuth).pipe(
      take(1), // Ensure the subscription is automatically unsubscribed after the first emission
      switchMap((isAuth) => {
        if (isAuth) {
          return this.store.select(selectBearerToken).pipe(
            take(1), // Ensure the subscription is automatically unsubscribed after the first emission
            map((bearerToken) => {
              request = request.clone({
                setHeaders: {
                  Authorization: 'Bearer ' + bearerToken,
                },
              });
              return request;
            })
          );
        } else {
          return of(request);
        }
      }),
      switchMap((modifiedRequest) => next.handle(modifiedRequest))
    );
  }
}
