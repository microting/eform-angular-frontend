import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnectionStringComponent} from './components/connection-string/connection-string.component';
import {FormsModule} from '@angular/forms';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './components/settings.component';
import {HelpersModule} from 'app/modules/helpers/helpers.module';
import {AdminSettingsComponent} from './components/admin-settings/admin-settings.component';
import {TooltipModule} from 'ngx-bootstrap';
import {FileUploadModule} from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    HelpersModule,
    TooltipModule.forRoot(),
    FileUploadModule
  ],
  declarations: [ConnectionStringComponent, SettingsComponent, AdminSettingsComponent]
})
export class SettingsModule {
}
