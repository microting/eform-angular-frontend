import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStateService } from 'src/app/common/store';
import {Observable, take} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {selectAuthIsAuth} from 'src/app/state/auth/auth.selector';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    //private authStateService: AuthStateService
  private store: Store
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectAuthIsAuth).pipe(
      take(1), // Ensure the subscription is automatically unsubscribed after the first emission
      tap((isAuth) => {
        if (!isAuth) {
          console.debug(`Let's kick the user out admin.guard`);
          this.router.navigate(['/auth']).then();
        }
      }),
      switchMap(() => this.store.select(selectAuthIsAuth)),
      take(1) // Ensure the subscription is automatically unsubscribed after the first emission
    );
  }
  // canActivate(): boolean {
  //   if (!this.authStateService.isAuth) {
  //     console.debug(`Let's kick the user out admin.guard`);
  //     this.router.navigate(['/auth']).then();
  //     return false;
  //   } else {
  //     return this.authStateService.isAdmin;
  //   }
  // }
}
