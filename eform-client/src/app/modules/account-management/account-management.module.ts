import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';

import {
  ChangePasswordComponent,
  NewUserModalComponent,
  ProfileSettingsComponent,
  RemoveUserModalComponent,
  UserEditModalComponent,
  UsersPageComponent,
} from './components';
import {AccountManagementRouting} from './account-management.routing';
import {TranslateModule} from '@ngx-translate/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {usersPersistProvider} from './components/users/store/users.store';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatCardModule} from '@angular/material/card';

@NgModule({
    imports: [
        CommonModule,
        AccountManagementRouting,
        EformSharedModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        FontAwesomeModule,
        MatSortModule,
        MatCheckboxModule,
        MDBBootstrapModule,
        MatButtonModule,
        MatFormFieldModule,
        MtxSelectModule,
        MatCardModule,
    ],
  declarations: [
    ChangePasswordComponent,
    ProfileSettingsComponent,
    UsersPageComponent,
    UserEditModalComponent,
    NewUserModalComponent,
    RemoveUserModalComponent,
  ],
  providers: [usersPersistProvider],
})
export class AccountManagementModule {
}
