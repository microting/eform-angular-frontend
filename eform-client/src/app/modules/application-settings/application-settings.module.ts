import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ConnectionStringComponent} from './components/connection-string/connection-string.component';
import {FormsModule} from '@angular/forms';
import {ApplicationSettingsRoutingModule} from './application-settings-routing.module';
import {ApplicationSettingsComponent} from './components/application-settings.component';
import {HelpersModule} from 'app/modules/helpers/helpers.module';
import {AdminSettingsComponent} from './components/admin-settings/admin-settings.component';
import {TooltipModule} from 'ngx-bootstrap';
import {FileUploadModule} from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    ApplicationSettingsRoutingModule,
    FormsModule,
    HelpersModule,
    TooltipModule,
    TranslateModule.forChild(),
    FileUploadModule
  ],
  declarations: [ConnectionStringComponent, ApplicationSettingsComponent, AdminSettingsComponent]
})
export class ApplicationSettingsModule {
}
