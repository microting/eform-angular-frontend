import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {UserComponent} from './components/user/user.component';
import {GoogleAuthenticatorComponent} from "./components/google-authenticator/google-authenticator.component";

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
    path: 'google-authenticator',
    component: GoogleAuthenticatorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagementRoutingModule {
}
