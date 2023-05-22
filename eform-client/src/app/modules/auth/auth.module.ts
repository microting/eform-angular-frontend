import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {AuthRouting} from './auth.routing';
import {
  AuthComponent,
  GoogleAuthenticatorComponent,
  LoginComponent,
  ResetAdminPasswordComponent,
  RestorePasswordComponent,
  RestorePasswordConfirmationComponent,
  SignOutComponent,
} from './components';
import {MatCardModule} from '@angular/material/card';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MtxSelectModule} from '@ng-matero/extensions/select';


@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    AuthRouting,
    ReactiveFormsModule,
    EformSharedModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MtxSelectModule
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
