import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EformXlsxReportContainerComponent,
  EformXlsxReportHeaderComponent,
} from './components';
import { TranslateModule } from '@ngx-translate/core';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// TODO import {
//   ButtonsModule,
//   CardsModule,
//   InputsModule,
//   ModalModule,
//   TableModule,
//   TooltipModule,
// } from 'angular-bootstrap-md';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { EformXlsxReportRouting } from './eform-xlsx-report.routing';

@NgModule({
  declarations: [
    EformXlsxReportContainerComponent,
    EformXlsxReportHeaderComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    EformSharedModule,
    FontAwesomeModule,
// TODO     ButtonsModule,
    RouterModule,
// TODO     TooltipModule,
// TODO     TableModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
// TODO     InputsModule,
// TODO     CardsModule,
    EformXlsxReportRouting,
// TODO     ModalModule,
    FormsModule,
  ],
})
export class EformXlsxReportModule {}
