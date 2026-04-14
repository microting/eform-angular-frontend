import {Injectable, inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {CmsService} from 'src/app/common/services';
import {
  loadCmsConfig,
  loadCmsConfigFailure,
  loadCmsConfigSuccess,
  loadCmsLanding,
  loadCmsLandingFailure,
  loadCmsLandingSuccess,
} from './cms.actions';

@Injectable()
export class CmsEffects {
  private actions$ = inject(Actions);
  private cmsService = inject(CmsService);

  loadCmsConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCmsConfig),
      switchMap(() =>
        this.cmsService.getPublicConfig().pipe(
          map((result) =>
            result.success
              ? loadCmsConfigSuccess({isCmsEnabled: result.model.isCmsEnabled, isMenuSticky: result.model.isMenuSticky, themeVariant: result.model.themeVariant})
              : loadCmsConfigFailure({error: result.message})
          ),
          catchError((err) => of(loadCmsConfigFailure({error: err.message})))
        )
      )
    )
  );

  loadCmsLanding$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCmsLanding),
      switchMap(() =>
        this.cmsService.getPublicLanding().pipe(
          map((result) =>
            result.success
              ? loadCmsLandingSuccess({landingPage: result.model})
              : loadCmsLandingFailure({error: result.message})
          ),
          catchError((err) => of(loadCmsLandingFailure({error: err.message})))
        )
      )
    )
  );
}
