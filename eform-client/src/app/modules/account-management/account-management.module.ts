import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {
  ChangePasswordComponent,
  UserModalComponent,
  ProfileSettingsComponent,
  RemoveUserModalComponent,
  UsersPageComponent,
} from './components';
import {AccountManagementRouting} from './account-management.routing';
import {TranslateModule} from '@ngx-translate/core';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule,
        AccountManagementRouting,
        EformSharedModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        MatSortModule,
        MatCheckboxModule,
        MatButtonModule,
        MatFormFieldModule,
        MtxSelectModule,
        MatCardModule,
        MatTooltipModule,
        MtxGridModule,
        MatDialogModule,
        MatInputModule,
        MatIconModule,
    ],
  declarations: [
    ChangePasswordComponent,
    ProfileSettingsComponent,
    UsersPageComponent,
    UserModalComponent,
    RemoveUserModalComponent,
  ],
})
export class AccountManagementModule {
}
