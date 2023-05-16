import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {
  DeleteDeviceUserModalComponent,
  DeviceUsersPageComponent,
  EditCreateUserModalComponent,
  NewOtpModalComponent,
} from './components';
import {DeviceUsersRouting} from './device-users.routing';
import {TranslateModule} from '@ngx-translate/core';
import {DeviceUsersPersistProvider} from './components/store';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';

@NgModule({
  imports: [
    CommonModule,
    DeviceUsersRouting,
    EformSharedModule,
    TranslateModule,
    FormsModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MtxSelectModule,
    MatInputModule,
    MtxGridModule,
    MatIconModule,
    MatDialogModule,
  ],
  declarations: [
    DeviceUsersPageComponent,
    NewOtpModalComponent,
    DeleteDeviceUserModalComponent,
    EditCreateUserModalComponent,
  ],
  providers: [DeviceUsersPersistProvider],
})
export class DeviceUsersModule {
}
