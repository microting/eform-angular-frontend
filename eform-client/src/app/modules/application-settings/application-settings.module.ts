import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {FileUploadModule} from 'ng2-file-upload';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {ApplicationSettingsRouting} from './application-settings.routing';
import {AdminSettingsComponent, ConnectionSetupComponent} from './components';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SharedPnModule} from 'src/app/plugins/modules/shared/shared-pn.module';

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        ApplicationSettingsRouting,
        MDBBootstrapModule,
        EformSharedModule,
        FormsModule,
        TranslateModule,
        FileUploadModule,
        FontAwesomeModule,
        SharedPnModule
    ],
  declarations: [AdminSettingsComponent, ConnectionSetupComponent]
})
export class ApplicationSettingsModule { }
