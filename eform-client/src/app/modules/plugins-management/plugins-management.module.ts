import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from '../../common/modules/eform-shared/eform-shared.module';
import {PluginsManagementRouting} from './plugins-management.routing';
import {
  InstalledPluginModalComponent,
  InstalledPluginsPageComponent,
  MarketplacePluginsPageComponent,
  MarketplacePluginInstallComponent,
  InstalledPluginPermissionsComponent
} from './components';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    EformSharedModule,
    FormsModule,
    TranslateModule,
    PluginsManagementRouting,
    MatCheckboxModule,
    MatButtonModule,
    MtxGridModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
  ],
  declarations: [
    InstalledPluginsPageComponent,
    InstalledPluginModalComponent,
    MarketplacePluginsPageComponent,
    MarketplacePluginInstallComponent,
    InstalledPluginPermissionsComponent,
  ],
})
export class PluginsManagementModule {
}
