import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EformExcelReportContainerComponent,
  EformExcelReportHeaderComponent,
  EformExcelReportHeaderEditorComponent,
} from './components';
import { TranslateModule } from '@ngx-translate/core';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  ButtonsModule,
  CardsModule,
  InputsModule,
  ModalModule,
  TableModule,
  TooltipModule,
} from 'angular-bootstrap-md';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { EformExcelReportRouting } from './eform-excel-report.routing';

@NgModule({
  declarations: [
    EformExcelReportContainerComponent,
    EformExcelReportHeaderComponent,
    EformExcelReportHeaderEditorComponent,
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
    EformExcelReportRouting,
    ModalModule,
    FormsModule,
  ],
})
export class EformExcelReportModule {}
