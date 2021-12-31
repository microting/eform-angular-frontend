import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';
// TODO import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { EformsRouting } from './eforms.routing';
import {
  EformColumnsModalComponent,
  EformCreateModalComponent,
  EformEditParingModalComponent,
  EformEditTagsModalComponent,
  EformExcelReportModalComponent,
  EformRemoveEformModalComponent,
  EformsBulkImportModalComponent,
  EformsPageComponent,
  EformUploadZipModalComponent,
  EformsTagsComponent,
} from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { persistProvider } from 'src/app/modules/eforms/store';
import { EformSharedTagsModule } from 'src/app/common/modules/eform-shared-tags/eform-shared-tags.module';
import {MdbTooltipModule} from 'mdb-angular-ui-kit/tooltip';

@NgModule({
  imports: [
    CommonModule,
    EformsRouting,
    NgSelectModule,
// TODO     MDBBootstrapModule,
    EformSharedModule,
    ReactiveFormsModule,
    FileUploadModule,
    FormsModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    OwlDateTimeModule,
    EformSharedTagsModule,
    MdbTooltipModule,
  ],
  declarations: [
    EformsPageComponent,
    EformEditParingModalComponent,
    EformCreateModalComponent,
    EformColumnsModalComponent,
    EformEditTagsModalComponent,
    EformRemoveEformModalComponent,
    EformUploadZipModalComponent,
    EformExcelReportModalComponent,
    EformsBulkImportModalComponent,
    EformsTagsComponent,
  ],
  providers: [persistProvider],
})
export class EFormsModule {}
