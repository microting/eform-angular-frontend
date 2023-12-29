import {
  AppMenuState,
  AuthState,
  EformsState,
  DeviceUsersState,
  AppSettingsState,
  EmailRecipientsState,
  SecurityState,
  EntitySearchState,
  EntitySelectState,
  CasesState,
  UsersState,
} from './';

export interface AppState {
  appMenus: AppMenuState;
  auth: AuthState;
  eforms: EformsState
  deviceUsers: DeviceUsersState;
  appSettings: AppSettingsState;
  emailRecipients: EmailRecipientsState;
  security: SecurityState;
  entitySearch: EntitySearchState;
  entitySelect: EntitySelectState;
  cases: CasesState;
  users: UsersState;
}
