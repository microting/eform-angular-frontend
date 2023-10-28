import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { UserClaimsEnum } from 'src/app/common/const';
import { AuthStateService } from 'src/app/common/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {selectCurretnUserClaims} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@Injectable()
export class ClaimsGuard implements CanActivate {
  private selectCurrentUserClaims$ = this.authStore.select(selectCurretnUserClaims);
  constructor(
    private authStore: Store
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const claim = UserClaimsEnum[route.data['requiredClaim']] as string;
    console.log(claim);
    return this.checkGuards([claim]).pipe(
      map(x => {
        console.log(claim);
        console.log(x);
        return !!(x && claim);
      }
    ));
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
