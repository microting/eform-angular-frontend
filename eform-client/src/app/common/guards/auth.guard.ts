import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn, Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, filter, map, take, timeout} from 'rxjs/operators';
import {
  selectAuthIsAuth,
  selectLoginRedirectUrl
} from 'src/app/state';
import {loadCmsConfig, selectIsCmsEnabled, selectCmsIsLoaded} from 'src/app/state/cms';

@Injectable()
export class AuthGuard {
  private store = inject(Store);
  private router = inject(Router);

  private isAuth$ = this.store.select(selectAuthIsAuth);
  private isCmsEnabled$ = this.store.select(selectIsCmsEnabled);
  private isCmsLoaded$ = this.store.select(selectCmsIsLoaded);
  private loginRedirectUrl$ = this.store.select(selectLoginRedirectUrl);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    // Trigger the load if not already done — the guard is the entry point
    // for unauthenticated visits so this must be self-sufficient.
    this.isCmsLoaded$.pipe(take(1)).subscribe(isLoaded => {
      if (!isLoaded) {
        this.store.dispatch(loadCmsConfig());
      }
    });

    return combineLatest([
      this.isAuth$,
      this.isCmsEnabled$,
      this.isCmsLoaded$,
      this.loginRedirectUrl$,
    ]).pipe(
      filter(([_isAuth, _isCmsEnabled, isCmsLoaded]) => isCmsLoaded),
      take(1),
      timeout(10000),
      map(([isAuth, isCmsEnabled, _isCmsLoaded, loginRedirectUrl]) => {
        if (!isAuth) {
          return this.router.createUrlTree([isCmsEnabled ? '/landing' : '/auth']);
        }
        if (loginRedirectUrl && (state.url === '/' || state.url === '/auth')) {
          return this.router.createUrlTree([`/${loginRedirectUrl}`]);
        }
        return true;
      }),
      catchError(() => {
        // CMS config failed to load in time — fall back to standard auth
        return of(this.router.createUrlTree(['/auth']));
      })
    );
  }
}

export const IsAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
  return inject(AuthGuard).canActivate(route, state);
}
