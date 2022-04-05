import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
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
  EformDuplicateConfirmModalComponent,
} from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { persistProvider } from 'src/app/modules/eforms/store';
import { EformSharedTagsModule } from 'src/app/common/modules/eform-shared-tags/eform-shared-tags.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {EformMatDateFnsDateModule} from 'src/app/common/modules/eform-date-adapter/eform-mat-datefns-date-adapter.module';
import {MatSortModule} from '@angular/material/sort';

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
        OwlDateTimeModule,
        EformSharedTagsModule,
        MatDatepickerModule,
        MatInputModule,
        EformMatDateFnsDateModule,
        MatSortModule
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
    EformDuplicateConfirmModalComponent,
  ],
  providers: [persistProvider],
})
export class EFormsModule {}
