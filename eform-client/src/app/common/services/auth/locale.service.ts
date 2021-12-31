import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { OperationDataResult } from 'src/app/common/models';
import { applicationLanguages } from 'src/app/common/const';
import { AuthStateService } from 'src/app/common/store';
import { ApiBaseService } from 'src/app/common/services';
import { translates } from 'src/assets/i18n/translates';

export let LocaleMethods = {
  // GoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  DefaultLocale: 'api/settings/default-locale',
};

@Injectable()
export class LocaleService {
  constructor(
    private apiBaseService: ApiBaseService,
    private authStateService: AuthStateService,
    private translateService: TranslateService,
    private cookieService: CookieService
  ) {}

  getDefaultLocale(): Observable<OperationDataResult<any>> {
    return this.apiBaseService.get<string>(LocaleMethods.DefaultLocale);
  }

  initLocale() {
    const arrayTranslate = [];
    // eslint-disable-next-line guard-for-in
    for (const translate in translates) {
      arrayTranslate.push(translate);
    }
    this.translateService.addLangs(arrayTranslate);
    let language = this.authStateService.currentUserLocale;
    this.translateService.setDefaultLang(applicationLanguages[1].locale);
    if (!language) {
      this.authStateService.updateUserLocale(applicationLanguages[1].locale);
      this.getDefaultLocale().subscribe((data) => {
        language = data.model;
        this.authStateService.updateUserLocale(language);
        this.translateService.use(language);
        // Set cookies
        this.initCookies(language);
      });
    } else {
      this.translateService.use(language);
      this.initCookies(language);
    }
  }

  // updateUserLocale(localeName: string) {
  //   this.authStateService.updateUserLocale(localeName);
  //   this.updateCookies(localeName);
  //   this.translateService.use(localeName);
  // }

  updateCurrentUserLocaleAndDarkTheme(localeName: string, darkTheme: boolean) {
    this.authStateService.updateCurrentUserLocaleAndDarkTheme(
      localeName,
      darkTheme
    );
    this.updateCookies(localeName);
    this.translateService.use(localeName);
  }

  initCookies(locale: string) {
    this.translateService.setDefaultLang(applicationLanguages[1].locale);
    let culture = this.buildCookieValue(applicationLanguages[1].locale);
    if (locale === applicationLanguages[0].locale) {
      culture = this.buildCookieValue(applicationLanguages[0].locale);
    } else if (locale) {
      culture = this.buildCookieValue(locale);
    }
    this.cookieService.set('culture', culture, 9999999, '/');
    this.cookieService.set('locale', locale, 9999999, '/');
  }

  buildCookieValue(locale: string) {
    return 'c=' + locale + '|uic=' + locale;
  }

  updateCookies(locale: string) {
    this.cookieService.set('locale', locale, 9999999, '/');
    this.cookieService.set(
      'culture',
      this.buildCookieValue(locale),
      9999999,
      '/'
    );
  }

  getCurrentUserLocale() {
    return this.authStateService.currentUserLocale;
  }
}
