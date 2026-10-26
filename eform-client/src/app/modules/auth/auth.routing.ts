import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  AuthComponent,
  DelegatedComponent,
  DelegatedStartComponent,
  GoogleAuthenticatorComponent,
  LoginComponent,
  RestorePasswordComponent,
  RestorePasswordConfirmationComponent,
  SignOutComponent
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
        // Listed BEFORE 'delegated' so the deeper path can never be shadowed by it. The
        // tenant's entry point: it mints the state the 'delegated' route checks on the way
        // back, which is what makes the flow tenant-initiated.
        path: 'delegated/start',
        component: DelegatedStartComponent
      },
      {
        path: 'delegated',
        component: DelegatedComponent
      },
      {
        path: 'restore-password',
        component: RestorePasswordComponent
      },
      {
        path: 'restore-password-confirmation',
        component: RestorePasswordConfirmationComponent,
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
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRouting {
}
