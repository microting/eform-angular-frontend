import {AppMenuState} from 'src/app/state/app-menu/app-menu.reducer';
import {AuthState} from 'src/app/state/auth/auth.recuder';


export interface AppState {
  appMenus: AppMenuState;
  auth: AuthState;
}
