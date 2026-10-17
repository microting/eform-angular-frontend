import {createAction} from '@ngrx/store';
import {CmsPublicLandingModel} from 'src/app/common/models';

export const loadCmsConfig = createAction('[Cms] Load Config');

export const loadCmsConfigSuccess = createAction(
  '[Cms] Load Config Success',
  (payload: {isCmsEnabled: boolean; isMenuSticky: boolean; themeVariant?: 'eform' | 'workspace'}) => ({payload})
);

export const loadCmsConfigFailure = createAction(
  '[Cms] Load Config Failure',
  (payload: {error: string}) => ({payload})
);

export const loadCmsLanding = createAction('[Cms] Load Landing');

export const loadCmsLandingSuccess = createAction(
  '[Cms] Load Landing Success',
  (payload: {landingPage: CmsPublicLandingModel}) => ({payload})
);

export const loadCmsLandingFailure = createAction(
  '[Cms] Load Landing Failure',
  (payload: {error: string}) => ({payload})
);
