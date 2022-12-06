import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EformXlsxReportContainerComponent,
  EformXlsxReportHeaderComponent,
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
import { EformXlsxReportRouting } from './eform-xlsx-report.routing';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

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
    ButtonsModule,
    RouterModule,
    TooltipModule,
    TableModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    InputsModule,
    CardsModule,
    EformXlsxReportRouting,
    ModalModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class EformXlsxReportModule {}
