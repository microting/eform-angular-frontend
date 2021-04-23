import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthStateService } from 'src/app/common/store';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authStateService: AuthStateService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authStateService.isAuth) {
      request = request.clone({
        setHeaders: {
          Authorization: this.authStateService.bearerToken,
        },
      });
    }

    return next.handle(request);
  }
}
