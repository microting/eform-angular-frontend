import {HttpClient} from '@angular/common/http';
import {MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// Missing translation
export class EformMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.warn('Missing translation for: ' + params.key);
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
//           return 'da-DK';
//         default:
//           return localeId;
//       }
//     }
//     return 'en';
//   }
// }

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export let translateConfig = {
  loader: {
    provide: TranslateLoader,
    useFactory: (createTranslateLoader),
    deps: [HttpClient]
  },
  missingTranslationHandler: {provide: MissingTranslationHandler, useClass: EformMissingTranslationHandler}
};
