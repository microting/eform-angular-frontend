import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult} from 'src/app/common/models';
import {BaseService} from '../base.service';

export let LocaleMethods = {
  UpdateGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  DeleteGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  DefaultLocale: 'api/settings/default-locale'
};

@Injectable()
export class LocaleService extends BaseService {
  constructor(private _http: HttpClient, router: Router,
              toastrService: ToastrService,
              private translateService: TranslateService,
              private cookieService: CookieService) {
    super(_http, router, toastrService);
  }

  getDefaultLocale(): Observable<OperationDataResult<any>> {
    return this.get<string>(LocaleMethods.DefaultLocale);
  }

  initLocale() {
    let language = localStorage.getItem('locale');
    this.translateService.setDefaultLang('en-US');
    if (!language) {
      localStorage.setItem('locale', 'en-US');
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
  }

  getCurrentUserLocale() {
    let currentUserLocale = localStorage.getItem('locale');
    if (!currentUserLocale) {
      currentUserLocale = 'en-US';
      localStorage.setItem('locale', currentUserLocale);
      this.translateService.setDefaultLang('en-US');
      this.translateService.use(currentUserLocale);
    }
    return currentUserLocale;
  }


  initCookies(locale: string) {
    this.translateService.setDefaultLang('en-US');
    let culture = '';
      if (locale === 'da-DK') {
        culture = this.buildCookieValue('da');
      } else {
        culture = this.buildCookieValue('en-US');
      }
    this.cookieService.set('culture', culture);
    this.cookieService.set('locale', locale);
  }

  buildCookieValue(locale: string) {
    return 'c=' + locale + '|uic=' + locale;
  }

  updateCookies(locale: string) {
    this.cookieService.set('locale', locale);
    this.cookieService.set('culture', this.buildCookieValue(locale));
  }
}
