import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
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
import { securityPersistProvider } from './components/store/security.store';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MtxSelectModule} from '@ng-matero/extensions/select';

@NgModule({
  imports: [
    EformSharedModule,
    CommonModule,
    SecurityRouting,
    TranslateModule,
    FormsModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MtxGridModule,
    MatDialogModule,
    MatCardModule,
    MtxSelectModule,
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
