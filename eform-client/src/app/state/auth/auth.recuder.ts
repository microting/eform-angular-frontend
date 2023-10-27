import {UserClaimsModel} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  authenticate,
  ConnectionStringExistCount,
  loadAuthFailure,
  loadAuthSuccess,
  refreshToken,
  updateUserInfo
} from 'src/app/state/auth/auth.actions';

export interface AuthState {
  token: {
    accessToken: string;
    expiresIn: any;
    tokenType: string;
    role: string;
  };
  currentUser: {
    firstName: string;
    lastName: string;
    id: number;
    userName: string;
    locale: string;
    languageId: number;
    darkTheme: boolean;
    loginRedirectUrl: string;
    claims: UserClaimsModel;
  };
  connectionString: {
    isConnectionStringExist: boolean;
    count: number;
  };
  sideMenuOpened: boolean;
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const createInitialState: AuthState = {
  token: {
    accessToken: '',
    expiresIn: '',
    tokenType: '',
    role: '',
  },
  currentUser: {
    firstName: '',
    lastName: '',
    id: 0,
    userName: '',
    locale: 'da', // TODO add env for test run
    languageId: 0,
    darkTheme: false,
    loginRedirectUrl: '',
    claims: {
      unitsRead: false,
      unitsUpdate: false,
      workersCreate: false,
      workersRead: false,
      workersUpdate: false,
      workersDelete: false,
      sitesCreate: false,
      sitesRead: false,
      sitesUpdate: false,
      sitesDelete: false,
      entitySearchCreate: false,
      entitySearchRead: false,
      entitySearchUpdate: false,
      entitySearchDelete: false,
      entitySelectCreate: false,
      entitySelectRead: false,
      entitySelectUpdate: false,
      entitySelectDelete: false,
      deviceUsersCreate: false,
      deviceUsersRead: false,
      deviceUsersUpdate: false,
      deviceUsersDelete: false,
      usersCreate: false,
      usersRead: false,
      usersUpdate: false,
      usersDelete: false,
      eformsCreate: false,
      eformsDelete: false,
      eformsRead: false,
      eformsUpdateColumns: false,
      eformsDownloadXml: false,
      eformsUploadZip: false,
      casesRead: false,
      caseRead: false,
      caseUpdate: false,
      caseDelete: false,
      caseGetPdf: false,
      caseGetDocx: false,
      caseGetPptx: false,
      eformsPairingUpdate: false,
      eformsUpdateTags: false,
      eformsPairingRead: false,
      eformsReadTags: false,
      eformsGetCsv: false,
      eformsReadJasperReport: false,
      eformsUpdateJasperReport: false,
      eformAllowManagingEformTags: false,
    },
  },
  connectionString: {
    isConnectionStringExist: false,
    count: 0,
  },
  sideMenuOpened: true,
  error: null,
  status: 'pending',
};

export const _authReducer = createReducer(
  createInitialState,
  on(authenticate, (state) => ({
    ...state,
    status: 'loading',
    }),
  ),
  on(refreshToken, (state, {payload}) => ({
    ...state,
    status: 'loading',
    token: payload.token,
    connectionString: {
      isConnectionStringExist: true,
      count: 2,
    },
    }),
  ),
  on(ConnectionStringExistCount, (state, {payload}) => ({
    ...state,
    status: 'success',
    connectionString: {
      isConnectionStringExist: payload.isConnectionStringExist,
      count: payload.count,
    },
    })),
  on(loadAuthSuccess, (state, {payload}) => ({
    ...state,
    status: 'success',
    error: null,
    token: payload.token,
    currentUser: payload.currentUser,
    connectionString: {
      isConnectionStringExist: true,
      count: payload.count,
    },
    })),
  on(updateUserInfo, (state, {payload}) => ({
    ...state,
    status: 'success',
    currentUser: {
      ...state.currentUser,
      darkTheme: payload.userSettings.model.darkTheme,
      locale: payload.userSettings.model.locale,
      loginRedirectUrl: payload.userSettings.model.loginRedirectUrl || '',
      claims: payload.userClaims,
    },
  })),
  on(loadAuthFailure, (state, {payload}) => ({
    ...state,
    error: payload,
    status: 'error',
    })),
);
export function reducer(state: AuthState | undefined, action: any) {
  return _authReducer(state, action);
}
