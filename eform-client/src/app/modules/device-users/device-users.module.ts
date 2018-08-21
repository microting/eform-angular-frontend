import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {MDBBootstrapModule} from 'port/angular-bootstrap-md';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {
  CreateNewUserModalComponent,
  DeleteDeviceUserModalComponent,
  DeviceUsersPageComponent,
  EditDeviceUserModalComponent,
  NewOtpModalComponent
} from './components';
import {DeviceUsersRouting} from './device-users.routing';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    DeviceUsersRouting,
    NgSelectModule,
    MDBBootstrapModule,
    EformSharedModule,
    TranslateModule,
    FormsModule
  ],
  declarations: [
    DeviceUsersPageComponent,
    NewOtpModalComponent,
    DeleteDeviceUserModalComponent,
    CreateNewUserModalComponent,
    EditDeviceUserModalComponent
  ]
})
export class DeviceUsersModule { }
