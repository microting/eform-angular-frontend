import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
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
export class PermissionGuard {
  private selectAuthIsLoading$ = this.store.select(selectAuthIsLoading);
  private selectAuthIsSuccess$ = this.store.select(selectAuthIsSuccess);
  public selectIsAuth$ = this.store.select(selectAuthIsAuth);
  private selectCurrentUserClaims$ = this.store.select(selectCurretnUserClaims);
  constructor(
    private store: Store
  ) {
    // eslint-disable-next-line no-console
    console.log('PermissionGuard - constructor');
  }

  canActivate (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) : Observable<boolean> {
    // eslint-disable-next-line no-console
    console.log('PermissionGuard - canActivate');
    let requiredPermission = route.data['requiredPermission'];
    requiredPermission = requiredPermission.replace(/_([a-z])/g, function (g: string[]) { return g[1].toUpperCase(); });
    // return this.checkGuards([requiredPermission]).pipe(
    //     map(x => {
    //         return !!(x && requiredPermission);
    //       }
    //     ));
    // @ts-ignore
    return this.selectAuthIsLoading$.pipe(
      map((isLoading) => {
        if (!isLoading) {
          // eslint-disable-next-line no-console
          console.log('ClaimsGuard - canActivate - !isLoading');
          return this.selectAuthIsSuccess$.pipe(
            take(1),
            map((isSuccess) => {
              if (isSuccess) {
                // eslint-disable-next-line no-console
                console.log('ClaimsGuard - canActivate - isSuccess');
                return this.selectIsAuth$.pipe(
                  take(1),
                  map((isAuth) => {
                    if (isAuth) {
                      // eslint-disable-next-line no-console
                      console.log('ClaimsGuard - canActivate - isAuth');
                      return this.selectCurrentUserClaims$.pipe(
                        take(1),
                        map((currentUserClaims) => {
                          for (const guard of requiredPermission) {
                            if (currentUserClaims[guard]) {
                              return true;
                            }
                          }
                          return false;
                        })
                      );
                    }
                    return false;
                  })
                );
              }
              return false;
            })
          );
        }
        return false;
      })
    );
  }
  // checkGuards(guards: string[]): Observable<boolean> {
  //   console.log('PermissionGuard - checkGuards');
  //   return this.selectCurrentUserClaims$.pipe(map(x => {
  //     for (const guard of guards) {
  //       if (x[guard]) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   }));
  // }
}


export const IsPermissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  // eslint-disable-next-line no-console
  console.log('PermissionGuard - IsPermissionGuard');
  return inject(PermissionGuard).canActivate(route, state);
}
