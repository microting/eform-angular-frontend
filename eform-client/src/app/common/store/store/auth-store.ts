/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { UserClaimsModel } from 'src/app/common/models';
import {debounceTime} from 'rxjs/operators';

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
  connectionString: {
    isConnectionStringExist: boolean;
    count: number;
  };
}

export function createInitialState(): AuthState {
  console.log('Constructor AuthStateService called');
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
        eformAllowManagingEformTags: false,
      },
    },
    connectionString: {
      isConnectionStringExist: true,
      count: 0,
    },
  };
}

const authPersistStorage = persistState({
  include: ['auth'],
  key: 'mainStore',
  // preStorageUpdate(storeName, state: AuthState): AuthState {
  //   console.log(`mainStore.auth.preStorageUpdate \n ${JSON.stringify(state)}`);
  //   return {
  //     currentUser: state.currentUser,
  //     token: state.token,
  //     connectionString: {
  //       isConnectionStringExist: state.connectionString.isConnectionStringExist,
  //       count: 0
  //     },
  //   };
  // },
  //preStorageUpdateOperator: () => debounceTime(5000),
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth', resettable: true })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super(createInitialState());
    //console.log(`mainStore.auth.constructor \n ${JSON.stringify(this._value())}`);
  }

  reset(): void {
    //console.log(`mainStore.auth.reset \n ${JSON.stringify(this._value())}`);
    super.reset();
    this.update(() => createInitialState());
  }
}

export const authPersistProviders = {
  provide: 'persistStorage',
  useValue: authPersistStorage,
  multi: true,
};
