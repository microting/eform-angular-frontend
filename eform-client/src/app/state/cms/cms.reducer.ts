import {createReducer, on} from '@ngrx/store';
import {CmsPublicLandingModel} from 'src/app/common/models';
import {
  loadCmsConfig,
  loadCmsConfigFailure,
  loadCmsConfigSuccess,
  loadCmsLanding,
  loadCmsLandingFailure,
  loadCmsLandingSuccess,
} from './cms.actions';

export const CMS_REDUCER_NODE = 'cms';

export interface CmsState {
  isCmsEnabled: boolean;
  isMenuSticky: boolean;
  landingPage: CmsPublicLandingModel | null;
  isLoading: boolean;
  isLoaded: boolean;
}

export const cmsInitialState: CmsState = {
  isCmsEnabled: false,
  isMenuSticky: false,
  landingPage: null,
  isLoading: false,
  isLoaded: false,
};

const _cmsReducer = createReducer(
  cmsInitialState,
  on(loadCmsConfig, (state) => ({...state, isLoading: true})),
  on(loadCmsConfigSuccess, (state, {payload}) => ({
    ...state,
    isCmsEnabled: payload.isCmsEnabled,
    isMenuSticky: payload.isMenuSticky,
    isLoading: false,
    isLoaded: true,
  })),
  on(loadCmsConfigFailure, (state) => ({...state, isLoading: false, isLoaded: true})),
  on(loadCmsLanding, (state) => ({...state, isLoading: true})),
  on(loadCmsLandingSuccess, (state, {payload}) => ({
    ...state,
    landingPage: payload.landingPage,
    isLoading: false,
  })),
  on(loadCmsLandingFailure, (state) => ({...state, isLoading: false})),
);

export function cmsReducer(state: CmsState | undefined, action: any) {
  return _cmsReducer(state, action);
}
