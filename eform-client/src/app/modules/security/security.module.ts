import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { SecurityGroupGeneralPermissionsService } from 'src/app/common/services';
import { SecurityRouting } from './security.routing';
import {
  SecurityPageComponent,
  SecurityGroupCreateComponent,
  SecurityGroupRemoveComponent,
  SecurityGroupUpdateComponent,
  SecurityGroupGeneralPermissionsComponent,
  SecurityGroupEformsPermissionsComponent,
  SecurityGroupEformsAddComponent,
  SecurityGroupEformsEditComponent,
  SecurityGroupEformsDeleteComponent,
  SecurityGroupSettingsComponent,
} from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { securityPersistProvider } from './components/store/security.store';

@NgModule({
  imports: [
    EformSharedModule,
    CommonModule,
    SecurityRouting,
    NgSelectModule,
    TranslateModule,
    MDBBootstrapModule,
    FormsModule,
    FontAwesomeModule,
  ],
  declarations: [
    SecurityPageComponent,
    SecurityGroupCreateComponent,
    SecurityGroupRemoveComponent,
    SecurityGroupUpdateComponent,
    SecurityGroupGeneralPermissionsComponent,
    SecurityGroupEformsPermissionsComponent,
    SecurityGroupEformsAddComponent,
    SecurityGroupEformsEditComponent,
    SecurityGroupEformsDeleteComponent,
    SecurityGroupSettingsComponent,
  ],
  providers: [SecurityGroupGeneralPermissionsService, securityPersistProvider],
})
export class SecurityModule {}
