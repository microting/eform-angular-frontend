import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { OperationDataResult } from 'src/app/common/models';
import { BaseService } from '../base.service';
import { applicationLanguages } from 'src/app/common/const/application-languages.const';

export let LocaleMethods = {
  UpdateGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  DeleteGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  DefaultLocale: 'api/settings/default-locale',
};

@Injectable()
export class LocaleService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService,
    private translateService: TranslateService,
    private cookieService: CookieService
  ) {
    super(_http, router, toastrService);
  }

  getDefaultLocale(): Observable<OperationDataResult<any>> {
    return this.get<string>(LocaleMethods.DefaultLocale);
  }

  initLocale() {
    let language = localStorage.getItem('locale');
    this.translateService.setDefaultLang(applicationLanguages[0].locale);
    if (!language) {
      localStorage.setItem('locale', applicationLanguages[0].locale);
      this.getDefaultLocale().subscribe((data) => {
        language = data.model;
        localStorage.setItem('locale', language);
        this.translateService.use(language);
        // Set cookies
        this.initCookies(language);
      });
    } else {
      this.translateService.use(language);
      this.initCookies(language);
    }
  }

  updateUserLocale(localeName: string) {
    localStorage.setItem('locale', localeName);
    this.updateCookies(localeName);
    this.translateService.use(localeName);
  }

  getCurrentUserLocale() {
    let currentUserLocale = localStorage.getItem('locale');
    if (!currentUserLocale) {
      currentUserLocale = applicationLanguages[0].locale;
      localStorage.setItem('locale', currentUserLocale);
      this.translateService.setDefaultLang(currentUserLocale);
      this.translateService.use(currentUserLocale);
    }
    return currentUserLocale;
  }

  initCookies(locale: string) {
    this.translateService.setDefaultLang(applicationLanguages[0].locale);
    let culture = this.buildCookieValue(applicationLanguages[0].locale);
    if (locale === applicationLanguages[1].locale) {
      culture = this.buildCookieValue(applicationLanguages[1].locale);
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
}
