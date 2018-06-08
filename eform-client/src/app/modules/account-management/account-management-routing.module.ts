import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserSettingsComponent} from './components/user-settings/user-settings.component';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {UserComponent} from './components/user/user.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'settings',
    component: UserSettingsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagementRoutingModule {
}
