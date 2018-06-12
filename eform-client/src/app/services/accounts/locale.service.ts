import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {BaseService} from '../base.service';

export let LocaleMethods = {
  UpdateGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  DeleteGoogleAuthenticatorInfo: 'api/auth/google-auth-info'
};

@Injectable()
export class LocaleService extends BaseService {
  constructor(private _http: Http, router: Router, private translateService: TranslateService) {
    super(_http, router);
  }

  initLocale() {
    debugger;
    let language = localStorage.getItem('locale');
    if (!language) {
      language = 'en-US';
      localStorage.setItem('locale', language);
    }
    this.translateService.setDefaultLang('en-US');
    this.translateService.use(language);
  }

  updateUserLocale(localeName: string) {
    localStorage.setItem('locale', localeName);
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
}
