import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserClaimsEnum} from 'src/app/common/const';
import {AdminGuard} from 'src/app/common/guards';
import {ClaimsGuard} from 'src/app/common/guards/claims.guard';
import {ChangePasswordComponent, ProfileSettingsComponent, UsersPageComponent} from './components';

const routes: Routes = [
  {
    path: 'users',
    component: UsersPageComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.usersRead}
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
