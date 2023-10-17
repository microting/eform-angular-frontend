import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AppMenuService} from 'src/app/common/services';
import {loadAppMenu, loadAppMenuFailure, loadAppMenuSuccess} from 'src/app/state/app-menu/app-menu.actions';
import {exhaustMap, mergeMap, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {inject, Injectable} from '@angular/core';

@Injectable()

export class AppMenuEffects {
  constructor(
    private actions$: Actions,
    //private store: Store<AppState>,
    private appMenuService: AppMenuService,
  ) {
  }

loadAppMenu$ = createEffect(() => this.actions$.pipe(
  ofType('[AppMenu] Load AppMenu'),
  mergeMap(() => this.appMenuService.getAppMenuFromServer()
    .pipe(
      map((appMenu: any) => loadAppMenuSuccess(appMenu)),
      catchError((error: any) => of(loadAppMenuFailure(error)))
    ))
  )
);
}
// export const loadAppMenu$ = createEffect(
//   (actions$ = inject(Actions), appMenuService = inject(AppMenuService)) => {
//     debugger;
//     return actions$.pipe(
//       ofType('[App Menu] Load App Menu'),
//       mergeMap(() =>
//         appMenuService.getAppMenuFromServer().pipe(map((appMenu: any) => ({type: '[App Menu] Load App Menu Success', payload: appMenu})),
//        catchError((error: any) => of(loadAppMenuFailure(error)))
//      ))
//     );
//   },
//   { functional: true }
// );
