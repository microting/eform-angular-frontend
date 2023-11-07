import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthStateService } from 'src/app/common/store';
import {Store} from '@ngrx/store';
import {selectAuthIsAuth, selectLoginRedirectUrl} from 'src/app/state/auth/auth.selector';
import {Observable, take} from "rxjs";
import {switchMap, tap} from "rxjs/operators";

@Injectable()
export class AuthGuard {
  constructor(
    private router: Router,
    //private authStateService: AuthStateService
    private store: Store
  ) {
  }

  private isAuth$ = this.store.select(selectAuthIsAuth);
  private loginRedirectUrl$ = this.store.select(selectLoginRedirectUrl);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
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
  return inject(AuthGuard).canActivate(route, state);
}
