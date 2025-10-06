import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import {Observable, take} from 'rxjs';
import {map} from 'rxjs/operators';
import {
  selectCurrentUserClaims
} from 'src/app/state';
import {Store} from '@ngrx/store';

@Injectable()
export class PermissionGuard {
  private store = inject(Store);

  private selectCurrentUserClaims$ = this.store.select(selectCurrentUserClaims);

  constructor() {
    console.debug('PermissionGuard - constructor');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    console.debug('PermissionGuard - canActivate');
    let requiredPermission = route.data['requiredPermission'];
    requiredPermission = requiredPermission.replace(/_([a-z])/g, function (g: string[]) {
      return g[1].toUpperCase();
    });
    return this.selectCurrentUserClaims$.pipe(
      take(1),
      map((currentUserClaims) => {
        return currentUserClaims[requiredPermission] && currentUserClaims[requiredPermission] === 'True';
      })
    );
  }
}


export const IsPermissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  console.debug('PermissionGuard - IsPermissionGuard');
  return inject(PermissionGuard).canActivate(route, state);
};
