import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {AuthService} from 'src/app/common/services';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class UserClaimsInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.headers.get('claimupdate')) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.authService.refreshToken().subscribe((token) => {
              localStorage.setItem('currentAuth', JSON.stringify(token.model));
              this.authService.obtainUserClaims().subscribe((claims) => {
                localStorage.setItem('userClaims', JSON.stringify(claims.model));
                this.isRefreshing = false;
              });
            });
          }
        }
      })
    );
  }
}
