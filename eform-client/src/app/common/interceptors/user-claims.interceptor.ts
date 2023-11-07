import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthStateService } from 'src/app/common/store';

@Injectable()
export class UserClaimsInterceptor implements HttpInterceptor {
  constructor(private authStateService: AuthStateService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.headers.get('claimupdate')) {
          //this.authStateService.refreshToken();
        }
      })
    );
  }
}
