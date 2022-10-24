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
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ButtonsModule, CardsModule, InputsModule, ModalModule, TableModule, TooltipModule,} from 'angular-bootstrap-md';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OwlDateTimeModule} from '@danielmoncada/angular-datetime-picker';
import {EformDocxReportRouting} from './eform-docx-report.routing';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';

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
        FontAwesomeModule,
        ButtonsModule,
        RouterModule,
        TooltipModule,
        TableModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        InputsModule,
        CardsModule,
        EformDocxReportRouting,
        ModalModule,
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
