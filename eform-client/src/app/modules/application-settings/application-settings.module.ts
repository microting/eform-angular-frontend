import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';
// TODO import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { ApplicationSettingsRouting } from './application-settings.routing';
import { AdminSettingsComponent, ConnectionSetupComponent } from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MdbTooltipModule} from 'mdb-angular-ui-kit/tooltip';
import {MdbFormsModule} from 'mdb-angular-ui-kit/forms';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    ApplicationSettingsRouting,
// TODO    MDBBootstrapModule,
    EformSharedModule,
    FormsModule,
    TranslateModule,
    FileUploadModule,
    FontAwesomeModule,
    MdbTooltipModule,
    MdbFormsModule,
  ],
  declarations: [AdminSettingsComponent, ConnectionSetupComponent],
})
export class ApplicationSettingsModule {}
