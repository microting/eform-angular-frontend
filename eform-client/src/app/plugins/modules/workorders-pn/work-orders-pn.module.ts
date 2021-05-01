import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { WorkOrdersPnRoutingModule } from './work-orders-pn-routing.module';
import { WorkOrdersSettingsService, WorkOrdersService } from './services';
import { WorkOrdersPnLayoutComponent } from './layouts';
import {
  WorkOrdersSettingsComponent,
  WorkOrdersPageComponent,
  SettingsAddSiteModalComponent,
  SettingsRemoveSiteModalComponent,
  WorkOrdersImagesModalComponent,
  WorkOrdersFoldersModalComponent,
  WorkOrdersDeleteComponent,
  WorkordersStateService,
} from './components';
import {
  ButtonsModule,
  InputsModule,
  ModalModule,
  TableModule,
  TooltipModule,
} from 'angular-bootstrap-md';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GalleryModule } from '@ngx-gallery/core';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { SharedPnModule } from 'src/app/plugins/modules/shared/shared-pn.module';

@NgModule({
  imports: [
    CommonModule,
    WorkOrdersPnRoutingModule,
    TranslateModule,
    SharedPnModule,
    TableModule,
    TooltipModule,
    FontAwesomeModule,
    ModalModule,
    NgSelectModule,
    FormsModule,
    ButtonsModule,
    InputsModule,
    LightboxModule,
    GalleryModule,
    EformSharedModule,
  ],
  declarations: [
    WorkOrdersPnLayoutComponent,
    WorkOrdersSettingsComponent,
    WorkOrdersPageComponent,
    SettingsAddSiteModalComponent,
    SettingsRemoveSiteModalComponent,
    WorkOrdersImagesModalComponent,
    WorkOrdersFoldersModalComponent,
    WorkOrdersDeleteComponent,
  ],
  providers: [
    WorkOrdersService,
    WorkOrdersSettingsService,
    WorkordersStateService,
  ],
})
export class WorkOrdersPnModule {}
