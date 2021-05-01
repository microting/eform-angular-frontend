import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {NgSelectModule} from '@ng-select/ng-select';
import {MY_MOMENT_FORMATS} from 'src/app/common/helpers';

import {
  OuterInnerResourcePnOuterResourceService,
  OuterInnerResourcePnInnerResourceService, OuterInnerResourcePnReportsService,
  OuterInnerResourcePnSettingsService
} from './services';
import {OuterInnerResourcePnLayoutComponent} from './layouts';
import {SharedPnModule} from '../shared/shared-pn.module';
import {
  OuterResourceCreateComponent,
  OuterResourceDeleteComponent,
  OuterResourcesPageComponent,
  OuterResourceEditComponent,
  InnerResourceCreateComponent,
  InnerResourceDeleteComponent,
  InnerResourcesPageComponent,
  InnerResourceEditComponent,
  ReportPreviewTableComponent,
  ReportGeneratorFormComponent,
  OuterInnerResourceSettingsComponent,
  ReportGeneratorContainerComponent,
} from './components';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {OuterInnerResourcePnRouting} from './outer-inner-resource-pn-routing.module';
import {OwlDateTimeModule} from 'ng-pick-datetime-ex';


@NgModule({
  imports: [
    CommonModule,
    SharedPnModule,
    MDBBootstrapModule,
    OuterInnerResourcePnRouting,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    OwlDateTimeModule
  ],
  declarations: [
    OuterResourcesPageComponent,
    OuterResourceDeleteComponent,
    OuterResourceCreateComponent,
    OuterResourceEditComponent,
    InnerResourcesPageComponent,
    InnerResourceCreateComponent,
    InnerResourceEditComponent,
    InnerResourceDeleteComponent,
    OuterInnerResourcePnLayoutComponent,
    OuterInnerResourceSettingsComponent,
    ReportGeneratorContainerComponent,
    ReportGeneratorFormComponent,
    ReportPreviewTableComponent
  ],
  providers: [
    OuterInnerResourcePnOuterResourceService,
    OuterInnerResourcePnInnerResourceService,
    OuterInnerResourcePnSettingsService,
    OuterInnerResourcePnReportsService,
  ]
})
export class OuterInnerResourcePnModule { }
