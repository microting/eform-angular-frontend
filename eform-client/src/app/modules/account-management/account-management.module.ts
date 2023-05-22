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
import {usersPersistProvider} from './components/users/store/users.store';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatCardModule} from '@angular/material/card';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatDialogModule} from '@angular/material/dialog';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
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
  providers: [usersPersistProvider],
})
export class AccountManagementModule {
}
