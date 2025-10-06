import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, take} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {selectAuthIsAdmin, selectAuthIsAuth} from 'src/app/state';
import {AuthStateService} from 'src/app/common/store';

@Injectable()
export class AdminGuard {
  private router = inject(Router);
  private store = inject(Store);
  private authStateService = inject(AuthStateService);

  constructor() {
    console.debug('AdminGuard - constructor');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.debug('AdminGuard - canActivate');
    return this.store.select(selectAuthIsAuth).pipe(
      take(1), // Ensure the subscription is automatically unsubscribed after the first emission
      tap((isAuth) => {
        if (!isAuth) {
          console.debug(`Let's kick the user out admin.guard`);
          this.authStateService.logout();
        }
      }),
      switchMap(() => this.store.select(selectAuthIsAdmin)),
      take(1) // Ensure the subscription is automatically unsubscribed after the first emission
    );
  }
}

export const IsAdminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(AdminGuard).canActivate(route, state);
}
