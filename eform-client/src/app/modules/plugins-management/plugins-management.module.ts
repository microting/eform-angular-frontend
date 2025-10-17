import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {MatButtonModule} from '@angular/material/button';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
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
        ReactiveFormsModule,
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
