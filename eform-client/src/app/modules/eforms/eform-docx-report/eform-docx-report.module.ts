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
// import {OwlDateTimeModule} from '@danielmoncada/angular-datetime-picker';
import {EformDocxReportRouting} from './eform-docx-report.routing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';

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
        // OwlDateTimeModule,
        InputsModule,
        CardsModule,
        EformDocxReportRouting,
        ModalModule,
        FormsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatCardModule,
    ],
})
export class EformDocxReportModule {}
