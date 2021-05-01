import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ItemsPlanningPnLayoutComponent } from './layouts';
import {
  PairingGridPageComponent,
  PairingGridTableComponent,
  PairingGridUpdateComponent,
  PlanningAssignSitesModalComponent,
  PlanningCasePageComponent,
  PlanningCreateComponent,
  PlanningDeleteComponent,
  PlanningEditComponent,
  PlanningFoldersModalComponent,
  PlanningsContainerComponent,
  PlanningTagsComponent,
  UploadedDataDeleteComponent,
  UploadedDataPdfComponent,
  ItemsPlanningSettingsComponent,
  ReportContainerComponent,
  ReportHeaderComponent,
  ReportImagesComponent,
  ReportPostsComponent,
  ReportTableComponent,
  PlanningsBulkImportModalComponent,
  PlanningsHeaderComponent,
  PlanningsTableComponent,
  PlanningMultipleDeleteComponent,
} from './components';
import { RouterModule } from '@angular/router';
import { ItemsPlanningPnRouting } from './items-planning-pn.routing.module';
import {
  ItemsPlanningPnCasesService,
  ItemsPlanningPnPlanningsService,
  ItemsPlanningPnReportsService,
  ItemsPlanningPnSettingsService,
  ItemsPlanningPnTagsService,
  ItemsPlanningPnUploadedDataService,
  ItemsPlanningPnPairingService,
} from './services';
import { FileUploadModule } from 'ng2-file-upload';
import { OwlDateTimeModule } from 'ng-pick-datetime-ex';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { CasesModule } from 'src/app/modules';
import { EformSharedTagsModule } from 'src/app/common/modules/eform-shared-tags/eform-shared-tags.module';

@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    EformSharedModule,
    FontAwesomeModule,
    RouterModule,
    ItemsPlanningPnRouting,
    ReactiveFormsModule,
    FileUploadModule,
    OwlDateTimeModule,
    CasesModule,
    EformSharedTagsModule,
  ],
  declarations: [
    ItemsPlanningPnLayoutComponent,
    PlanningsContainerComponent,
    PlanningCreateComponent,
    PlanningCasePageComponent,
    PlanningEditComponent,
    PlanningDeleteComponent,
    PlanningAssignSitesModalComponent,
    PlanningFoldersModalComponent,
    PlanningTagsComponent,
    PlanningsBulkImportModalComponent,
    PairingGridPageComponent,
    PairingGridTableComponent,
    PairingGridUpdateComponent,
    ItemsPlanningSettingsComponent,
    ReportContainerComponent,
    ReportHeaderComponent,
    ReportTableComponent,
    ReportPostsComponent,
    ReportImagesComponent,
    UploadedDataPdfComponent,
    UploadedDataDeleteComponent,
    PlanningsHeaderComponent,
    PlanningsTableComponent,
    PlanningMultipleDeleteComponent,
  ],
  providers: [
    ItemsPlanningPnSettingsService,
    ItemsPlanningPnPlanningsService,
    ItemsPlanningPnReportsService,
    ItemsPlanningPnCasesService,
    ItemsPlanningPnUploadedDataService,
    ItemsPlanningPnTagsService,
    ItemsPlanningPnPairingService,
  ],
})
export class ItemsPlanningPnModule {}
