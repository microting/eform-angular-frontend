import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {FileUploadModule} from 'ng2-file-upload';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {ApplicationSettingsRouting} from './application-settings.routing';
import {AdminSettingsComponent} from './components';
import {appSettingsProvider} from './components/store';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MtxSelectModule} from '@ng-matero/extensions/select';

@NgModule({
  imports: [
    CommonModule,
    ApplicationSettingsRouting,
    EformSharedModule,
    FormsModule,
    TranslateModule,
    FileUploadModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MtxSelectModule,
  ],
  declarations: [AdminSettingsComponent],
  providers: [appSettingsProvider],
})
export class ApplicationSettingsModule {
}
