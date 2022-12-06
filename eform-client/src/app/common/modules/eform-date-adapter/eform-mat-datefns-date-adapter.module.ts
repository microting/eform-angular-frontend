import { NgModule } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { EFORM_MAT_DATEFNS_DATE_FORMATS } from './eform-mat-datefns-date-formats';
import { EformDateFnsDateAdapter, EFORM_MAT_DATEFNS_DATE_ADAPTER_OPTIONS } from './eform-mat-datefns-date-adapter';
import { EFORM_MAT_DATEFNS_LOCALES } from './eform-mat-datefns-locales';

@NgModule({
  providers: [
    {
      provide: DateAdapter,
      useClass: EformDateFnsDateAdapter,
      deps: [MAT_DATE_LOCALE, EFORM_MAT_DATEFNS_LOCALES, EFORM_MAT_DATEFNS_DATE_ADAPTER_OPTIONS],
    },
  ],
})
export class EformDateFnsDateModule {}

@NgModule({
  imports: [EformDateFnsDateModule],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: EFORM_MAT_DATEFNS_DATE_FORMATS },
    { provide: EFORM_MAT_DATEFNS_LOCALES, useValue: [] },
  ],
})
export class EformMatDateFnsDateModule {}
