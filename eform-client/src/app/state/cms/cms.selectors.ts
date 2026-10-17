import {createSelector} from '@ngrx/store';
import {AppState} from 'src/app/state/app.state';

export const selectCmsState = (state: AppState) => state.cms;

export const selectIsCmsEnabled = createSelector(selectCmsState, (state) => state.isCmsEnabled);
export const selectIsMenuSticky = createSelector(selectCmsState, (state) => state.isMenuSticky);
export const selectCmsThemeVariant = createSelector(selectCmsState, (state) => state.themeVariant);
export const selectCmsLandingPage = createSelector(selectCmsState, (state) => state.landingPage);
export const selectCmsIsLoading = createSelector(selectCmsState, (state) => state.isLoading);
export const selectCmsIsLoaded = createSelector(selectCmsState, (state) => state.isLoaded);
