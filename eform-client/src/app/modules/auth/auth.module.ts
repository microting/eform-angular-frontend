import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {AuthRouting} from './auth.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MDBBootstrapModule} from 'port/angular-bootstrap-md';
import {TranslateModule} from '@ngx-translate/core';
import {
  GoogleAuthenticatorComponent,
  LoginComponent,
  ResetAdminPasswordComponent,
  RestorePasswordComponent, SignOutComponent,
  AuthComponent, RestorePasswordConfirmationComponent
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
    AuthComponent
  ]
})
export class AuthModule {
}
