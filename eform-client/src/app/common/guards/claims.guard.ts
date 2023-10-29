import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { UserClaimsEnum } from 'src/app/common/const';
import { AuthStateService } from 'src/app/common/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {selectCurretnUserClaims} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@Injectable()
export class ClaimsGuard {
  private selectCurrentUserClaims$ = this.authStore.select(selectCurretnUserClaims);
  constructor(
    private authStore: Store
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredPermission = UserClaimsEnum[route.data['requiredClaim']] as string;
    return this.checkGuards([requiredPermission]).pipe(
      map(x => {
          console.log(x);
          return !!(x && requiredPermission);
        }
      ));
    // return true;
    // TODO: Fix this
    // const claim = UserClaimsEnum[route.data['requiredClaim']] as string;
    // console.log(claim);
    // return this.checkGuards([claim]).pipe(
    //   map(x => {
    //     console.log(claim);
    //     console.log(x);
    //     return !!(x && claim);
    //   }
    // ));
    // return !claim || this.checkGuards(claim);
    // return userClaims.hasOwnProperty(claim) && userClaims[claim] === 'True';
  }

  checkGuards(guards: string[]): Observable<boolean> {
    return this.selectCurrentUserClaims$.pipe(map(x => {
      for (const guard of guards) {
        if (x[guard]) {
          return true;
        }
      }
      return false;
    }));
  }
}

export const IsClaimsGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(ClaimsGuard).canActivate(route, state);
}
