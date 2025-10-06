import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn, Router,
  RouterStateSnapshot,
} from '@angular/router';
import {Store} from '@ngrx/store';
import {
  selectAuthIsAuth,
  selectLoginRedirectUrl
} from 'src/app/state';

@Injectable()
export class AuthGuard {
  private store = inject(Store);
  private router = inject(Router);

  constructor() {
    this.isAuth$.subscribe(x => this.isAuth = x);
    this.loginRedirectUrl$.subscribe(x => this.loginRedirectUrl = x);
  }

  private isAuth: boolean = false;
  private loginRedirectUrl: string = '';
  private isAuth$ = this.store.select(selectAuthIsAuth);
  private loginRedirectUrl$ = this.store.select(selectLoginRedirectUrl);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
      if (!this.isAuth) {
        console.debug(`Let's kick the user out auth.guard`);
        this.router.navigate(['/auth']).then();
        return false;
      }
      if (
        this.loginRedirectUrl &&
        (state.url === '/' || state.url === '/auth')
      ) {
        this.router
          .navigate([`/${this.loginRedirectUrl}`])
          .then();
        return false;
      }
    return true;
  }
}

export const IsAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuard).canActivate(route, state);
}
