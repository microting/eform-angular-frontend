import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {MDBBootstrapModule} from 'port/angular-bootstrap-md/mdb-free.module';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {PluginsSettingsPageComponent, PluginSettingsEditComponent} from './components';
import {PluginsSettingsRouting} from './plugins-settings.routing';

@NgModule({
  imports: [
    PluginsSettingsRouting,
    CommonModule,
    EformSharedModule,
    MDBBootstrapModule,
    FormsModule,
    TranslateModule,
    NgSelectModule
  ],
  declarations: [PluginsSettingsPageComponent, PluginSettingsEditComponent]
})
export class PluginsSettingsModule {
}
