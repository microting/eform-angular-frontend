import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
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
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        AccountManagementRouting,
        NgSelectModule,
        EformSharedModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        FontAwesomeModule,
        MatSortModule,
        MatCheckboxModule,
        MDBBootstrapModule,
        MatButtonModule,
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
