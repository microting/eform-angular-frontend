import { InjectionToken } from '@angular/core';
import { Locale } from 'date-fns';

export const EFORM_MAT_DATEFNS_LOCALES = new InjectionToken<Locale[]>(
  'EFORM_MAT_DATEFNS_LOCALES'
);
