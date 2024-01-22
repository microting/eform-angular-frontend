import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AUTH_REDUCER_NODE, AuthState} from 'src/app/state/auth/auth.recuder';
import {AppState} from 'src/app/state';

export const authFeatureSelector = createFeatureSelector<AuthState>(AUTH_REDUCER_NODE);

export const selectAuth = (state: AppState) => state.auth;

export const selectAuthIsLoading
  = createSelector(selectAuth, (state: AuthState) => state.status === 'loading');
export const selectAuthIsSuccess
  = createSelector(selectAuth, (state: AuthState) => state.status === 'success');
export const selectAuthToken
  = createSelector(selectAuth, (state: AuthState) => state.token);
export const selectAuthIsAuth
  = createSelector(selectAuth, (state: AuthState) => !!(state.token && state.token.accessToken && state.token.accessToken !== ''));
export const selectAuthIsAdmin
  = createSelector(selectAuth, (state: AuthState) => !!(state.token && state.token.role && state.token.role === 'admin'));
export const selectBearerToken
  = createSelector(selectAuthToken, (state) => state.accessToken);
export const selectAuthUser
  = createSelector(selectAuth, (state: AuthState) => state.currentUser);
export const selectAuthError
  = createSelector(selectAuth, (state: AuthState) => state.error);
export const selectConnectionStringWithCount
  = createSelector(selectAuth, (state: AuthState) => state.connectionString);
export const selectConnectionStringExists
  = createSelector(selectConnectionStringWithCount, (state) => state.isConnectionStringExist);
export const selectLoginRedirectUrl
  = createSelector(selectAuthUser, (state) => state.loginRedirectUrl);
export const selectSideMenuOpened
  = createSelector(selectAuth, (state: AuthState) => state.sideMenuOpened);
export const selectIsDarkMode
  = createSelector(selectAuthUser, (state) => state.darkTheme);
export const selectCurrentUserLocale
  = createSelector(selectAuthUser, (state) => state.locale);
export const selectCurrentUserLanguageId
  = createSelector(selectAuthUser, (state) => state.languageId);
export const selectCurrentUserName
  = createSelector(selectAuthUser, (state) => state.userName);
export const selectCurrentUserFullName
  = createSelector(selectAuthUser, (state) => `${state.firstName} ${state.lastName}`);
export const selectCurrentUserIsAdmin
  = createSelector(selectAuthToken, (state) => state.role === 'Admin');
export const selectCurrentUserClaims
  = createSelector(selectAuthUser, (state) => state.claims);
export const selectCurrentUserClaimsUsersUpdate
  = createSelector(selectCurrentUserClaims, (state) => state.usersUpdate);
export const selectCurrentUserClaimsUsersDelete
  = createSelector(selectCurrentUserClaims, (state) => state.usersDelete);
export const selectCurrentUserClaimsUsersCreate
  = createSelector(selectCurrentUserClaims, (state) => state.usersCreate);
export const selectCurrentUserClaimsCaseUpdate
  = createSelector(selectCurrentUserClaims, (state) => state.caseUpdate);
export const selectCaseDelete
  = createSelector(selectCurrentUserClaims, (state) => state.caseDelete);
export const selectCaseGetPdf
  = createSelector(selectCurrentUserClaims, (state) => state.caseGetPdf);
export const selectCaseGetDocx
  = createSelector(selectCurrentUserClaims, (state) => state.caseGetDocx);
export const selectCaseGetPptx
  = createSelector(selectCurrentUserClaims, (state) => state.caseGetPptx);
export const selectCurrentUserClaimsUnitsRead
  = createSelector(selectCurrentUserClaims, (state) => state.unitsRead);
export const selectCurrentUserClaimsUnitsUpdate
  = createSelector(selectCurrentUserClaims, (state) => state.unitsUpdate);
export const selectCurrentUserClaimsSitesCreate
  = createSelector(selectCurrentUserClaims, (state) => state.sitesCreate);
export const selectCurrentUserClaimsSitesRead
  = createSelector(selectCurrentUserClaims, (state) => state.sitesRead);
export const selectCurrentUserClaimsSitesUpdate
  = createSelector(selectCurrentUserClaims, (state) => state.sitesUpdate);
export const selectCurrentUserClaimsSitesDelete
  = createSelector(selectCurrentUserClaims, (state) => state.sitesDelete);
export const selectCurrentUserClaimsWorkersCreate
  = createSelector(selectCurrentUserClaims, (state) => state.workersCreate);
export const selectCurrentUserClaimsWorkersRead
  = createSelector(selectCurrentUserClaims, (state) => state.workersRead);
export const selectCurrentUserClaimsWorkersUpdate
  = createSelector(selectCurrentUserClaims, (state) => state.workersUpdate);
export const selectCurrentUserClaimsWorkersDelete
  = createSelector(selectCurrentUserClaims, (state) => state.workersDelete);
export const selectCurrentUserClaimsEntitySearchCreate
  = createSelector(selectCurrentUserClaims, (state) => state.entitySearchCreate);
export const selectCurrentUserClaimsEntitySearchRead
  = createSelector(selectCurrentUserClaims, (state) => state.entitySearchRead);
export const selectCurrentUserClaimsEntitySearchUpdate
  = createSelector(selectCurrentUserClaims, (state) => state.entitySearchUpdate);
export const selectCurrentUserClaimsEntitySearchDelete
  = createSelector(selectCurrentUserClaims, (state) => state.entitySearchDelete);
export const selectCurrentUserClaimsEntitySelectCreate
  = createSelector(selectCurrentUserClaims, (state) => state.entitySelectCreate);
export const selectCurrentUserClaimsEntitySelectRead
  = createSelector(selectCurrentUserClaims, (state) => state.entitySelectRead);
export const selectCurrentUserClaimsEntitySelectUpdate
  = createSelector(selectCurrentUserClaims, (state) => state.entitySelectUpdate);
export const selectCurrentUserClaimsEntitySelectDelete
  = createSelector(selectCurrentUserClaims, (state) => state.entitySelectDelete);
export const selectCurrentUserClaimsEformsCreate
  = createSelector(selectCurrentUserClaims, (state) => state.eformsCreate);
export const selectEformAllowManagingEformTags
  = createSelector(selectCurrentUserClaims, (state) => state.eformAllowManagingEformTags);
export const selectCurrentUserClaimsDeviceUsersRead
  = createSelector(selectCurrentUserClaims, (state) => state.deviceUsersRead);
export const selectCurrentUserClaimsDeviceUsersUpdate
  = createSelector(selectCurrentUserClaims, (state) => state.deviceUsersUpdate);
export const selectCurrentUserClaimsDeviceUsersDelete
  = createSelector(selectCurrentUserClaims, (state) => state.deviceUsersDelete);
export const selectCurrentUserClaimsDeviceUsersCreate
  = createSelector(selectCurrentUserClaims, (state) => state.deviceUsersCreate);
export const selectCurrentUserClaimsEformsRead
  = createSelector(selectCurrentUserClaims, (state) => state.eformsRead);
export const selectCurrentUserClaimsEformsDelete
  = createSelector(selectCurrentUserClaims, (state) => state.eformsDelete);
export const selectCurrentUserClaimsEformsUpdateColumns
  = createSelector(selectCurrentUserClaims, (state) => state.eformsUpdateColumns);
export const selectCurrentUserClaimsEformsDownloadXml =
  createSelector(selectCurrentUserClaims, (state) => state.eformsDownloadXml);
export const selectCurrentUserClaimsEformsUploadZip =
  createSelector(selectCurrentUserClaims, (state) => state.eformsUploadZip);
export const selectCurrentUserClaimsEformsPairingUpdate =
  createSelector(selectCurrentUserClaims, (state) => state.eformsPairingUpdate);
export const selectCurrentUserClaimsEformsUpdateTags =
  createSelector(selectCurrentUserClaims, (state) => state.eformsUpdateTags);
export const selectCurrentUserClaimsEformsPairingRead
  = createSelector(selectCurrentUserClaims, (state) => state.eformsPairingRead);
export const selectCurrentUserClaimsEformsReadTags =
  createSelector(selectCurrentUserClaims, (state) => state.eformsReadTags);
export const selectCurrentUserClaimsEformsGetCsv =
  createSelector(selectCurrentUserClaims, (state) => state.eformsGetCsv);
export const selectCurrentUserClaimsEformsReadJasperReport =
  createSelector(selectCurrentUserClaims, (state) => state.eformsReadJasperReport);
export const selectCurrentUserClaimsEformsUpdateJasperReport =
  createSelector(selectCurrentUserClaims, (state) => state.eformsUpdateJasperReport);

