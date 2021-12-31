import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { EformSharedModule } from '../../common/modules/eform-shared/eform-shared.module';
// TODO import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { PluginsManagementRouting } from './plugins-management.routing';
import {
  InstalledPluginModalComponent,
  InstalledPluginsPageComponent,
  MarketplacePluginsPageComponent,
  MarketplacePluginInstallComponent,
} from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InstalledPluginPermissionsComponent } from './components/installed/installed-plugin-permissions/installed-plugin-permissions.component';

@NgModule({
  imports: [
    CommonModule,
    EformSharedModule,
// TODO     MDBBootstrapModule,
    FormsModule,
    TranslateModule,
    NgSelectModule,
    PluginsManagementRouting,
    FontAwesomeModule,
  ],
  declarations: [
    InstalledPluginsPageComponent,
    InstalledPluginModalComponent,
    MarketplacePluginsPageComponent,
    MarketplacePluginInstallComponent,
    InstalledPluginPermissionsComponent,
  ],
})
export class PluginsManagementModule {}
