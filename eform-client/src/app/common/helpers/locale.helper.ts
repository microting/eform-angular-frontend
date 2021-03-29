import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
} from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { translates } from '../../../assets/i18n/translates';

// custom loader translates
export class EformTranslateLoader implements TranslateLoader {
  constructor() {}

  public getTranslation(lang: string): Observable<any> {
    return new Observable((observer) => {
      observer.next(translates[lang]);
      observer.complete();
    });
  }
}

// Missing translation
export class EformMissingTranslationHandler
  implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    // console.warn('Missing translation for: ' + params.key);
    return params.key;
  }
}

// Locale helper
// export class LocaleHelper {
//   getDatePickerLocale(): string {
//     const localeId = localStorage.getItem('localeId');
//     if (localeId) {
//       switch (localeId) {
//         case 'da':
//           return 'da';
//         default:
//           return localeId;
//       }
//     }
//     return 'en';
//   }
// }

export let translateConfig = {
  loader: {
    provide: TranslateLoader,
    // AoT requires an exported function for factories
    useFactory: () => new EformTranslateLoader(),
  },
  missingTranslationHandler: {
    provide: MissingTranslationHandler,
    useClass: EformMissingTranslationHandler,
  },
};
