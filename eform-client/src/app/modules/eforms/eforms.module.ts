import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {FileUploadModule} from 'ng2-file-upload';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {EformsRouting} from './eforms.routing';
import {
  EformColumnsModalComponent,
  EformCreateModalComponent,
  EformEditParingModalComponent,
  EformEditTagsModalComponent,
  EformExcelReportModalComponent,
  EformRemoveEformModalComponent,
  EformsPageComponent,
  EformUploadZipModalComponent
} from './components';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {OwlDateTimeModule} from '@danielmoncada/angular-datetime-picker';

@NgModule({
  imports: [
    CommonModule,
    EformsRouting,
    NgSelectModule,
    MDBBootstrapModule,
    EformSharedModule,
    ReactiveFormsModule,
    FileUploadModule,
    FormsModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    OwlDateTimeModule
  ],
  declarations: [
    EformsPageComponent,
    EformEditParingModalComponent,
    EformCreateModalComponent,
    EformColumnsModalComponent,
    EformEditTagsModalComponent,
    EformRemoveEformModalComponent,
    EformUploadZipModalComponent,
    EformExcelReportModalComponent
  ]
})
export class EFormsModule { }
