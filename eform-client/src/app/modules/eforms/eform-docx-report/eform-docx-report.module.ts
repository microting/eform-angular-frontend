import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  EformDocxReportContainerComponent,
  EformDocxReportHeaderComponent,
  EformDocxReportHeaderEditorComponent,
  EformDocxReportImagesComponent,
  EformDocxReportTableComponent,
} from './components';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OwlDateTimeModule} from '@danielmoncada/angular-datetime-picker';
import {EformDocxReportRouting} from './eform-docx-report.routing';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatIconModule} from '@angular/material/icon';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';

@NgModule({
  declarations: [
    EformDocxReportContainerComponent,
    EformDocxReportHeaderComponent,
    EformDocxReportTableComponent,
    EformDocxReportImagesComponent,
    EformDocxReportHeaderEditorComponent,
  ],
    imports: [
        CommonModule,
        TranslateModule,
        EformSharedModule,
        RouterModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        EformDocxReportRouting,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MtxGridModule,
        MatDialogModule,
        MatCardModule,
        MatTooltipModule,
    ],
})
export class EformDocxReportModule {}
