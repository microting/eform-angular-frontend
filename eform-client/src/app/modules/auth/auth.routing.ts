import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  LoginComponent,
  RestorePasswordComponent,
  GoogleAuthenticatorComponent,
  ResetAdminPasswordComponent, SignOutComponent, AuthComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    data: {
      title: 'Auth'
    },
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'restore-password',
        component: RestorePasswordComponent
      },
      {
        path: 'reset-admin-password',
        component: ResetAdminPasswordComponent
      }
    ]
  },
  {
    path: 'google-authenticator/:cypher',
    component: GoogleAuthenticatorComponent
  },
  {
    path: 'sign-out',
    component: SignOutComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRouting {
}
