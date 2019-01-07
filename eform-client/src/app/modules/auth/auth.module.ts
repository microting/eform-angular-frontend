import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MDBBootstrapModule} from 'port/angular-bootstrap-md';
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

@NgModule({
  imports: [
    FormsModule,
    MDBBootstrapModule,
    TranslateModule,
    CommonModule,
    AuthRouting,
    ReactiveFormsModule,
    EformSharedModule
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
