import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AdminService, AppSettingsService, AuthService} from 'src/app/common/services';
import {exhaustMap, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions,
              private settingsService: AppSettingsService,
              private adminService: AdminService,
              private authService: AuthService) {
  }

  authenticate$ = createEffect(() => this.actions$.pipe(
    ofType('[Auth] Authenticate'),
    exhaustMap((action) => this.authService.login(action)
      .pipe(
        map((auth: any) => ({type: '[Auth] Authenticate Success', payload: auth})),
        catchError((error: any) => of({type: '[Auth] Authenticate Failure', payload: error}))
      ))
    )
  );

  refreshToken$ = createEffect(() => this.actions$.pipe(
    ofType('[Auth] Refresh Token'),
    exhaustMap((action) => this.authService.refreshToken()
      .pipe(
        map((auth: any) => ({type: '[Auth] Authenticate Success', payload: auth})),
        catchError((error: any) => of({type: '[Auth] Authenticate Failure', payload: error}))
      ))
    )
  );

  updateConnectionString$ = createEffect(() => this.actions$.pipe(
    ofType('[Auth] Update Connection String'),
    exhaustMap((action) => this.settingsService.updateConnectionString(action)
      .pipe(
        map((auth: any) => ({type: '[Auth] Update Connection String Success', payload: auth})),
        catchError((error: any) => of({type: '[Auth] Update Connection String Failure', payload: error}))
      ))
    )
  );

  loadUserInformation$ = createEffect(() => this.actions$.pipe(
    ofType('[Auth] Load User Information'),
    exhaustMap(() => this.adminService.getCurrentUserInfo()
      .pipe(
        map((auth: any) => ({type: '[Auth] Load User Information Success', payload: auth})),
        catchError((error: any) => of({type: '[Auth] Load User Information Failure', payload: error}))
      ))
    )
  );

}
