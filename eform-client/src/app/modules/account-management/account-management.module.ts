import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';

import {
  ChangePasswordComponent,
  NewUserModalComponent,
  ProfileSettingsComponent,
  RemoveUserModalComponent,
  UserEditModalComponent,
  UsersPageComponent,
} from './components';
import { AccountManagementRouting } from './account-management.routing';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { usersPersistProvider } from './components/users/store/users.store';
import {MatSortModule} from '@angular/material/sort';

@NgModule({
    imports: [
        CommonModule,
        AccountManagementRouting,
        NgSelectModule,
        MDBBootstrapModule,
        EformSharedModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        FontAwesomeModule,
        MatSortModule,
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
export class AccountManagementModule {}
