import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {FileUploadModule} from 'ng2-file-upload';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {EformsRouting} from './eforms.routing';
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
  EformDuplicateConfirmModalComponent,
} from './components';
import {OwlDateTimeModule} from '@danielmoncada/angular-datetime-picker';
import {persistProvider} from 'src/app/modules/eforms/store';
import {EformSharedTagsModule} from 'src/app/common/modules/eform-shared-tags/eform-shared-tags.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {EformMatDateFnsDateModule} from 'src/app/common/modules/eform-date-adapter/eform-mat-datefns-date-adapter.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatCardModule} from '@angular/material/card';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MtxButtonModule} from '@ng-matero/extensions/button';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';

@NgModule({
    imports: [
        CommonModule,
        EformsRouting,
        EformSharedModule,
        ReactiveFormsModule,
        FileUploadModule,
        FormsModule,
        TranslateModule.forChild(),
        OwlDateTimeModule,
        EformSharedTagsModule,
        MatDatepickerModule,
        MatInputModule,
        EformMatDateFnsDateModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatMenuModule,
        MtxSelectModule,
        MatCardModule,
        MtxGridModule,
        MatTooltipModule,
        MtxButtonModule,
        MatChipsModule,
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
    EformDuplicateConfirmModalComponent,
  ],
  providers: [persistProvider],
  exports: []
})
export class EFormsModule {
}
