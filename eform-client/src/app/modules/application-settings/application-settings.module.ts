import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { ApplicationSettingsRouting } from './application-settings.routing';
import { AdminSettingsComponent, ConnectionSetupComponent } from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    ApplicationSettingsRouting,
    EformSharedModule,
    FormsModule,
    TranslateModule,
    FileUploadModule,
    FontAwesomeModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
  ],
  declarations: [AdminSettingsComponent, ConnectionSetupComponent],
})
export class ApplicationSettingsModule {}
