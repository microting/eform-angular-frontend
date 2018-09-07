import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard} from 'src/app/common/guards';
import {ChangePasswordComponent, ProfileSettingsComponent, UsersPageComponent} from './components';

const routes: Routes = [
  {
    path: 'users',
    canActivate: [AdminGuard],
    component: UsersPageComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'settings',
    component: ProfileSettingsComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagementRouting {
}
