import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EformDocxReportContainerComponent,
  EformDocxReportHeaderComponent,
  EformDocxReportImagesComponent,
  EformDocxReportTableComponent,
} from './components';
import { SharedPnModule } from 'src/app/plugins/modules/shared/shared-pn.module';
import { TranslateModule } from '@ngx-translate/core';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  ButtonsModule,
  CardsModule,
  InputsModule,
  TableModule,
  TooltipModule,
} from 'angular-bootstrap-md';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime-ex';

@NgModule({
  declarations: [
    EformDocxReportContainerComponent,
    EformDocxReportHeaderComponent,
    EformDocxReportTableComponent,
    EformDocxReportImagesComponent,
  ],
  imports: [
    CommonModule,
    SharedPnModule,
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
  ],
})
export class EformDocxReportModule {}
