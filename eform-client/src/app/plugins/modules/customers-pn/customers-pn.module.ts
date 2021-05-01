import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {MDBRootModule} from 'angular-bootstrap-md';
import { Papa } from 'ngx-papaparse';

import {CustomerPnLayoutComponent} from './layouts';
import {CustomersPnFieldsService, CustomersPnService, CustomersPnSettingsService} from './services';
import {CustomersPnRouting} from './customers-pn.routing';
import {SharedPnModule} from '../shared/shared-pn.module';

import {
  CustomerPnDeleteComponent,
  CustomerPnEditComponent,
  CustomersPnPageComponent,
  CustomersPnFieldsComponent,
  CustomerPnAddComponent,
  CustomerPnImportComponent
} from './components';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedPnModule,
        CustomersPnRouting,
        TranslateModule,
        MDBRootModule,
        NgSelectModule,
        FontAwesomeModule,
        EformSharedModule
    ],
  declarations: [
    CustomerPnLayoutComponent,
    CustomersPnPageComponent,
    CustomerPnEditComponent,
    CustomerPnDeleteComponent,
    CustomersPnFieldsComponent,
    CustomerPnAddComponent,
    CustomerPnImportComponent
  ],
  providers: [
    CustomersPnService,
    CustomersPnFieldsService,
    CustomersPnSettingsService
  ]
})
export class CustomersPnModule {
}
