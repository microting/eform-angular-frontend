import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivateFn, Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserClaimsEnum } from 'src/app/common/const';
import { AuthStateService } from 'src/app/common/store';
import {Observable, take} from 'rxjs';
import {map} from 'rxjs/operators';
import {
  selectAuthIsAuth,
  selectAuthIsLoading,
  selectAuthIsSuccess,
  selectCurretnUserClaims
} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@Injectable()
export class ClaimsGuard {

  private selectAuthIsLoading$ = this.store.select(selectAuthIsLoading);
  private selectAuthIsSuccess$ = this.store.select(selectAuthIsSuccess);
  private selectCurrentUserClaims$ = this.store.select(selectCurretnUserClaims);
  public selectIsAuth$ = this.store.select(selectAuthIsAuth);
  constructor(
    private router: Router,
    private store: Store
  ) {
    // eslint-disable-next-line no-console
    console.log('ClaimsGuard - constructor');}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // eslint-disable-next-line no-console
    console.log('ClaimsGuard - canActivate');
    const requiredPermission = UserClaimsEnum[route.data['requiredClaim']] as string;
    // eslint-disable-next-line no-console
    console.log('ClaimsGuard - canActivate - requiredPermission: ' + requiredPermission);
    let allowed = false;
    this.selectCurrentUserClaims$.subscribe(x => {
      if (x[requiredPermission]) {
        allowed = true;
      }
    });
    return allowed;
  }
}

export const IsClaimsGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  // eslint-disable-next-line no-console
  console.log('ClaimsGuard - IsClaimsGuard');
  return inject(ClaimsGuard).canActivate(route, state);
}
