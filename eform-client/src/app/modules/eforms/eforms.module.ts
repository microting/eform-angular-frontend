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
  EformRemoveEformModalComponent,
  EformsBulkImportModalComponent,
  EformsPageComponent,
  EformUploadZipModalComponent,
  EformsTagsComponent,
} from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { persistProvider } from 'src/app/modules/eforms/store';
import { EformSharedTagsModule } from 'src/app/common/modules/eform-shared-tags/eform-shared-tags.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTooltipModule} from '@angular/material/tooltip';

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
        // OwlDateTimeModule,
        EformSharedTagsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatTooltipModule,
    ],
  declarations: [
    EformsPageComponent,
    EformEditParingModalComponent,
    EformCreateModalComponent,
    EformColumnsModalComponent,
    EformEditTagsModalComponent,
    EformRemoveEformModalComponent,
    EformUploadZipModalComponent,
    EformsBulkImportModalComponent,
    EformsTagsComponent,
  ],
  providers: [persistProvider],
})
export class EFormsModule {}
