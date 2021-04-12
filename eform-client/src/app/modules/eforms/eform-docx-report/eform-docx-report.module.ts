import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EformDocxReportContainerComponent,
  EformDocxReportHeaderComponent,
  EformDocxReportImagesComponent,
  EformDocxReportTableComponent,
  EformDocxReportHeaderEditorComponent,
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
import { OwlDateTimeModule } from 'ng-pick-datetime-ex';
import { EformDocxReportRouting } from './eform-docx-report.routing';

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
  ],
})
export class EformDocxReportModule {}
