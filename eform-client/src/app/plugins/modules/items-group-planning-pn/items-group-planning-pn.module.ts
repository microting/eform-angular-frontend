import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPnModule} from '../shared/shared-pn.module';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {EformSharedModule} from '../../../common/modules/eform-shared/eform-shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ItemsGroupPlanningPnLayoutComponent} from './layouts';
import {
  ItemListCaseColumnsModalComponent,
  ItemsListCreateComponent,
  ListCasePageComponent,
  ListCaseResultPageComponent,
  ListDeleteComponent,
  ListEditComponent,
  ListsPageComponent,
  ItemCaseUploadedDataComponent,
  UploadedDataPdfComponent,
  UploadedDataDeleteComponent,
  ItemsGroupPlanningPnUnitImportComponent
} from './components/items-lists';
import {ItemsGroupPlanningSettingsComponent} from './components/items-group-plannings-setting';
import {RouterModule} from '@angular/router';
import {ItemsGroupPlanningPnRouting} from './items-group-planning-pn.routing.module';
import {ItemsGroupPlanningPnListsService,
  ItemsGroupPlanningPnSettingsService,
  ItemsGroupPlanningPnReportsService,
  ItemsGroupPlanningPnCasesService,
  ItemsGroupPlanningPnUploadedDataService} from './services';
import {
  ReportGeneratorContainerComponent,
  ReportGeneratorFormComponent,
  ReportPreviewTableComponent
} from './components/reports';
import {FileUploadModule} from 'ng2-file-upload';
import {OwlDateTimeModule} from 'ng-pick-datetime-ex';

@NgModule({
  imports: [
    CommonModule,
    SharedPnModule,
    MDBBootstrapModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    EformSharedModule,
    FontAwesomeModule,
    RouterModule,
    ItemsGroupPlanningPnRouting,
    ReactiveFormsModule,
    FileUploadModule,
    OwlDateTimeModule
  ],
  declarations: [
    ItemsGroupPlanningPnLayoutComponent,
    ItemListCaseColumnsModalComponent,
    ListsPageComponent,
    ListCaseResultPageComponent,
    ItemsListCreateComponent,
    ListCasePageComponent,
    ListEditComponent,
    ListDeleteComponent,
    ItemsGroupPlanningSettingsComponent,
    ReportGeneratorContainerComponent,
    ReportGeneratorFormComponent,
    ReportPreviewTableComponent,
    ItemCaseUploadedDataComponent,
    UploadedDataPdfComponent,
    UploadedDataDeleteComponent,
    ItemsGroupPlanningPnUnitImportComponent
  ],
  providers: [
    ItemsGroupPlanningPnSettingsService,
    ItemsGroupPlanningPnListsService,
    ItemsGroupPlanningPnReportsService,
    ItemsGroupPlanningPnCasesService,
    ItemsGroupPlanningPnUploadedDataService
  ]
})

export class ItemsGroupPlanningPnModule { }
