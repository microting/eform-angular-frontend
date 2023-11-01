import {AppMenuState} from 'src/app/state/app-menu/app-menu.reducer';
import {AuthState} from 'src/app/state/auth/auth.recuder';
import {EformsState} from 'src/app/state/eform/eform.reducer';
import {DeviceUsersState} from 'src/app/state/device-user/device-user.reducer';
import {AppSettingsState} from 'src/app/state/application-settings/application-settings.reducer';
import {EmailRecipientsState} from 'src/app/state/email-recipients/email-recipients.reducer';
import {SecurityState} from 'src/app/state/security/security.reducer';
import {EntitySearchState} from 'src/app/state/entity-search/entity-search.reducer';
import {EntitySelectState} from 'src/app/state/entity-select/entity-select.reducer';
import {CasesState} from 'src/app/state/cases/cases.reducer';


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
}
