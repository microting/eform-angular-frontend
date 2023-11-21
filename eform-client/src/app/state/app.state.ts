import {AppMenuState} from './app-menu/app-menu.reducer';
import {AuthState} from './auth/auth.recuder';
import {EformsState} from './eform/eform.reducer';
import {DeviceUsersState} from './device-user/device-user.reducer';
import {AppSettingsState} from './application-settings/application-settings.reducer';
import {EmailRecipientsState} from './email-recipients/email-recipients.reducer';
import {SecurityState} from './security/security.reducer';
import {EntitySearchState} from './entity-search/entity-search.reducer';
import {EntitySelectState} from './entity-select/entity-select.reducer';
import {CasesState} from './cases/cases.reducer';
import {UsersState} from './users/users.reducer';


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
