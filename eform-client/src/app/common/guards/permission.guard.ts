import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthStateService } from 'src/app/common/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {selectCurretnUserClaims} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@Injectable()
export class PermissionGuard {
  private selectCurrentUserClaims$ = this.authStore.select(selectCurretnUserClaims);
  constructor(
    private authStore: Store
  ) {}

  canActivate (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) : Observable<boolean> {
    const requiredPermission = route.data['requiredPermission'];
    return this.checkGuards([requiredPermission]).pipe(
        map(x => {
            console.log(x);
            return !!(x && requiredPermission);
          }
        ));
    // return true;
  //   TODO: Fix this
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<boolean> {
  //   const requiredPermission = route.data['requiredPermission'];
  //   // return !requiredPermission || this.authStateService.checkClaim(requiredPermission);
  //   return this.checkGuards([requiredPermission]).pipe(
  //     map(x => {
  //         console.log(x);
  //         return !!(x && requiredPermission);
  //       }
  //     ));
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


export const IsPermissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(PermissionGuard).canActivate(route, state);
}
