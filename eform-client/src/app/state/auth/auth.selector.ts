import {createSelector} from '@ngrx/store';
import {AuthState} from 'src/app/state/auth/auth.recuder';
import {AppState} from 'src/app/state/app.state';

export const selectAuth = (state: AppState) => state.auth;

export const selectAuthIsLoading
  = createSelector(selectAuth, (state: AuthState) => state.status === 'loading');
export const selectAuthIsSuccess
  = createSelector(selectAuth, (state: AuthState) => state.status === 'success');
export const selectAuthIsAuth
  = createSelector(selectAuth, (state: AuthState) => state.token.accessToken !== '');
export const selectBearerToken
  = createSelector(selectAuth, (state: AuthState) => state.token.accessToken);
export const selectAuthUser
  = createSelector(selectAuth, (state: AuthState) => state.currentUser);
export const selectAuthError
  = createSelector(selectAuth, (state: AuthState) => state.error);
export const selectConnectionStringExists
  = createSelector(selectAuth, (state: AuthState) => state.connectionString.isConnectionStringExist);
export const selectConnectionStringWithCount
  = createSelector(selectAuth, (state: AuthState) => state.connectionString);
export const selectLoginRedirectUrl
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.loginRedirectUrl);
export const selectSideMenuOpened
  = createSelector(selectAuth, (state: AuthState) => state.sideMenuOpened);
export const selectIsDarkMode
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.darkTheme);
export const selectCurrentUserLocale
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.locale);
export const selectCurrentUserLanguageId
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.languageId);
export const selectCurrentUserName
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.userName);
export const selectCurrentUserFullName
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.firstName + ' ' + state.currentUser.lastName);
export const selectCurrentUserIsAdmin
  = createSelector(selectAuth, (state: AuthState) => state.token.role === 'Admin');
export const selectCurretnUserClaims
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims);
export const selectCurrentUserClaimsUsersUpdate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.usersUpdate);
export const selectCurrentUserClaimsUsersDelete
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.usersDelete);
export const selectCurrentUserClaimsUsersCreate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.usersCreate);
export const selectCurrentUserClaims
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims);
export const selectCurrentUserClaimsCaseUpdate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.caseUpdate);
export const selectCaseDelete
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.caseDelete);
export const selectCaseGetPdf
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.caseGetPdf);
export const selectCaseGetDocx
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.caseGetDocx);
export const selectCaseGetPptx
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.caseGetPptx);
export const selectCurrentUserClaimsUnitsRead
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.unitsRead);
export const selectCurrentUserClaimsUnitsUpdate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.unitsUpdate);
export const selectCurrentUserClaimsSitesCreate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.sitesCreate);
export const selectCurrentUserClaimsSitesRead
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.sitesRead);
export const selectCurrentUserClaimsSitesUpdate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.sitesUpdate);
export const selectCurrentUserClaimsSitesDelete
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.sitesDelete);
export const selectCurrentUserClaimsWorkersCreate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.workersCreate);
export const selectCurrentUserClaimsWorkersRead
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.workersRead);
export const selectCurrentUserClaimsWorkersUpdate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.workersUpdate);
export const selectCurrentUserClaimsWorkersDelete
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.workersDelete);
export const selectCurrentUserClaimsEntitySearchCreate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.entitySearchCreate);
export const selectCurrentUserClaimsEntitySearchRead
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.entitySearchRead);
export const selectCurrentUserClaimsEntitySearchUpdate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.entitySearchUpdate);
export const selectCurrentUserClaimsEntitySearchDelete
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.entitySearchDelete);
export const selectCurrentUserClaimsEntitySelectCreate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.entitySelectCreate);
export const selectCurrentUserClaimsEntitySelectRead
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.entitySelectRead);
export const selectCurrentUserClaimsEntitySelectUpdate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.entitySelectUpdate);
export const selectCurrentUserClaimsEntitySelectDelete
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.entitySelectDelete);
export const selectCurrentUserClaimsEformsCreate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsCreate);
export const selectEformAllowManagingEformTags
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformAllowManagingEformTags);
export const selectCurrentUserClaimsDeviceUsersRead
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.deviceUsersRead);
export const selectCurrentUserClaimsDeviceUsersUpdate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.deviceUsersUpdate);
export const selectCurrentUserClaimsDeviceUsersDelete
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.deviceUsersDelete);
export const selectCurrentUserClaimsDeviceUsersCreate
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.deviceUsersCreate);
export const selectCurrentUserClaimsEformsRead
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsRead);
export const selectCurrentUserClaimsEformsDelete
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsDelete);
export const selectCurrentUserClaimsEformsUpdateColumns
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsUpdateColumns);
export const selectCurrentUserClaimsEformsDownloadXml =
  createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsDownloadXml);
export const selectCurrentUserClaimsEformsUploadZip =
  createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsUploadZip);
export const selectCurrentUserClaimsEformsPairingUpdate =
  createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsPairingUpdate);
export const selectCurrentUserClaimsEformsUpdateTags =
  createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsUpdateTags);
export const selectCurrentUserClaimsEformsPairingRead
  = createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsPairingRead);
export const selectCurrentUserClaimsEformsReadTags =
  createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsReadTags);
export const selectCurrentUserClaimsEformsGetCsv =
  createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsGetCsv);
export const selectCurrentUserClaimsEformsReadJasperReport =
  createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsReadJasperReport);
export const selectCurrentUserClaimsEformsUpdateJasperReport =
  createSelector(selectAuth, (state: AuthState) => state.currentUser.claims.eformsUpdateJasperReport);

