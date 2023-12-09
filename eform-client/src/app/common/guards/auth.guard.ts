import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import {Store} from '@ngrx/store';
import {
  selectAuthIsAuth,
  selectAuthIsLoading,
  selectAuthIsSuccess,
  selectLoginRedirectUrl
} from 'src/app/state/auth/auth.selector';

@Injectable()
export class AuthGuard {
  constructor(
    private store: Store
  ) {
    console.log('AuthGuard - constructor');
  }

  private selectAuthIsLoading$ = this.store.select(selectAuthIsLoading);
  private selectAuthIsSuccess$ = this.store.select(selectAuthIsSuccess);
  private isAuth$ = this.store.select(selectAuthIsAuth);
  private loginRedirectUrl$ = this.store.select(selectLoginRedirectUrl);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // eslint-disable-next-line
    console.log('AuthGuard - canActivate');
    // TODO: Fix this
    //   if (!this.isAuth$) {
    //     console.debug(`Let's kick the user out auth.guard`);
    //     this.router.navigate(['/auth']).then();
    //     return false;
    //   }
    //   if (
    //     this.loginRedirectUrl$ &&
    //     (state.url === '/' || state.url === '/auth')
    //   ) {
    //     this.router
    //       .navigate([`/${this.loginRedirectUrl$}`])
    //       .then();
    //     return false;
    //   }
    return true;
  }
}

export const IsAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  // eslint-disable-next-line
  console.log('AuthGuard - IsAuthGuard');
  return inject(AuthGuard).canActivate(route, state);
}
