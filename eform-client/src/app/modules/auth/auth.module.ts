import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
// TODO import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {AuthRouting} from './auth.routing';
import {
  AuthComponent,
  GoogleAuthenticatorComponent,
  LoginComponent,
  ResetAdminPasswordComponent,
  RestorePasswordComponent,
  RestorePasswordConfirmationComponent,
  SignOutComponent
} from './components';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  imports: [
    FormsModule,
// TODO   MDBBootstrapModule,
    TranslateModule,
    CommonModule,
    AuthRouting,
    ReactiveFormsModule,
    EformSharedModule,
    FontAwesomeModule
  ],
  declarations: [
    LoginComponent,
    RestorePasswordComponent,
    RestorePasswordConfirmationComponent,
    GoogleAuthenticatorComponent,
    ResetAdminPasswordComponent,
    SignOutComponent,
    AuthComponent,
    RestorePasswordConfirmationComponent
  ]
})
export class AuthModule {
}
