import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
// import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import {
  CreateNewUserModalComponent,
  DeleteDeviceUserModalComponent,
  DeviceUsersPageComponent,
  EditDeviceUserModalComponent,
  NewOtpModalComponent,
} from './components';
import { DeviceUsersRouting } from './device-users.routing';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceUsersPersistProvider } from './components/store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    DeviceUsersRouting,
    NgSelectModule,
// TODO    MDBBootstrapModule,
    EformSharedModule,
    TranslateModule,
    FormsModule,
    FontAwesomeModule,
  ],
  declarations: [
    DeviceUsersPageComponent,
    NewOtpModalComponent,
    DeleteDeviceUserModalComponent,
    CreateNewUserModalComponent,
    EditDeviceUserModalComponent,
  ],
  providers: [DeviceUsersPersistProvider],
})
export class DeviceUsersModule {}
