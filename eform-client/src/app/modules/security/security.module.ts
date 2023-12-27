import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {SecurityGroupGeneralPermissionsService} from 'src/app/common/services';
import {SecurityRouting} from './security.routing';
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
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
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
  providers: [SecurityGroupGeneralPermissionsService],
})
export class SecurityModule {
}
