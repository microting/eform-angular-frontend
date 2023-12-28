import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import {UserClaimsEnum} from 'src/app/common/const';
import {
  selectCurretnUserClaims
} from 'src/app/state';
import {Store} from '@ngrx/store';
import {UserClaimsModel} from 'src/app/common/models';

@Injectable()
export class ClaimsGuard {

  private claims: UserClaimsModel;
  private selectCurrentUserClaims$ = this.store.select(selectCurretnUserClaims);

  constructor(
    private store: Store
  ) {
    this.selectCurrentUserClaims$.subscribe(x => this.claims = x);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredPermission = UserClaimsEnum[route.data['requiredClaim']] as string;
    return this.claims[requiredPermission];
  }
}

export const IsClaimsGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(ClaimsGuard).canActivate(route, state);
};
