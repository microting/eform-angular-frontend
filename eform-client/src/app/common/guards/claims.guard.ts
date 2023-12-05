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
  ): Observable<boolean> {
    // eslint-disable-next-line no-console
    console.log('ClaimsGuard - canActivate');
    const requiredPermission = UserClaimsEnum[route.data['requiredClaim']] as string;
    // eslint-disable-next-line no-console
    console.log('ClaimsGuard - canActivate - requiredPermission: ' + requiredPermission);
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
    // return this.checkGuards([requiredPermission]).pipe(
    //   map(x => {
    //     console.log(requiredPermission);
    //     console.log(x);
    //       return !!(x && requiredPermission);
    //     }
    //   ));
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

  che/*ckGuards(guards: string[]): Observable<boolean> {
    // wait for selectAuthIsLoading$ to return false
    // then select selectAuthIsSuccess$ and take 1
    // then select selectIsAuth$ and take 1
    // then select selectCurrentUserClaims$ and take 1
    // then map the result
    // then return the result
    // @ts-ignore
    return this.selectAuthIsLoading$.pipe(
      map((isLoading) => {
        if (!isLoading) {
          return this.selectAuthIsSuccess$.pipe(
            take(1),
            map((isSuccess) => {
              if (isSuccess) {
                return this.selectIsAuth$.pipe(
                  take(1),
                  map((isAuth) => {
                    if (isAuth) {
                      return this.selectCurrentUserClaims$.pipe(
                        take(1),
                        map((currentUserClaims) => {
                          for (const guard of guards) {
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


    // console.log('ClaimsGuard - checkGuards');
    // return this.selectCurrentUserClaims$.pipe(map(x => {
    //   for (const guard of guards) {
    //     if (x[guard]) {
    //       return true;
    //     }
    //   }
    //   return false;
    // }));
  }*/
}

export const IsClaimsGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  // eslint-disable-next-line no-console
  console.log('ClaimsGuard - IsClaimsGuard');
  return inject(ClaimsGuard).canActivate(route, state);
}
