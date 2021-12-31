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
// TODO import {ButtonsModule, CardsModule, InputsModule, ModalModule, TableModule, TooltipModule,} from 'angular-bootstrap-md';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OwlDateTimeModule} from '@danielmoncada/angular-datetime-picker';
import {EformDocxReportRouting} from './eform-docx-report.routing';
import {MdbTooltipModule} from 'mdb-angular-ui-kit/tooltip';

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
// TODO     ButtonsModule,
    RouterModule,
// TODO     TooltipModule,
// TODO     TableModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
// TODO     InputsModule,
// TODO     CardsModule,
    EformDocxReportRouting,
// TODO     ModalModule,
    FormsModule,
    MdbTooltipModule,
  ],
})
export class EformDocxReportModule {}
