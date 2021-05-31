import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { UserClaimsModel } from 'src/app/common/models';

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
    darkTheme: boolean;
    loginRedirectUrl: string;
    claims: UserClaimsModel;
  };
}

export function createInitialState(): AuthState {
  console.log('AuthState.createInitialState()');
  return {
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
      locale: '',
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
      },
    },
  };
}

const authPersistStorage = persistState({
  include: ['auth'],
  key: 'mainStore',
  preStorageUpdate(storeName, state: AuthState): AuthState {
    console.log({ method: 'AuthStateService.preStorageUpdate()', state });
    return {
      currentUser: state.currentUser,
      token: state.token,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth', resettable: true })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super(createInitialState());
  }

  reset(): void {
    console.log({ method: 'before AuthState.reset()', value: this.getValue() });
    super.reset();
    console.log({ method: 'after AuthState.reset()', value: this.getValue() });
  }
}

export const authPersistProviders = {
  provide: 'persistStorage',
  useValue: authPersistStorage,
  multi: true,
};
