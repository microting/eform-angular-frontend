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
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatInputModule} from '@angular/material/input';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';

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
})
export class DeviceUsersModule {
}
