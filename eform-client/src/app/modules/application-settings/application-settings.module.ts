import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {FileUploadModule} from 'ng2-file-upload';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {ApplicationSettingsRouting} from './application-settings.routing';
import {AdminSettingsComponent} from './components';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
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
})
export class ApplicationSettingsModule {
}
