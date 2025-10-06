import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AppMenuService} from 'src/app/common/services';
import {loadAppMenu, loadAppMenuFailure, loadAppMenuSuccess} from './';
import {mergeMap, of, catchError, map} from 'rxjs';
import { Injectable, inject } from '@angular/core';
import {OperationDataResult, UserMenuModel} from 'src/app/common/models';

@Injectable()
export class AppMenuEffects {
  private actions$ = inject(Actions);
  private appMenuService = inject(AppMenuService);


loadAppMenu$ = createEffect(() => this.actions$.pipe(
  ofType(loadAppMenu),
  mergeMap(() => this.appMenuService.getAppMenuFromServer()
    .pipe(
      map((appMenu: OperationDataResult<UserMenuModel>) => loadAppMenuSuccess(appMenu)),
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
