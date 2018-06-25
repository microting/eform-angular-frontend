import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UserSettingsModel} from 'app/models/settings';
import {OperationDataResult} from 'app/modules';
import {UserSettingsMethods} from 'app/services/accounts/user-settings.service';
import {Observable} from 'rxjs/Observable';
import {BaseService} from '../base.service';

export let LocaleMethods = {
  UpdateGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  DeleteGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  DefaultLocale: 'api/settings/default-locale'
};

@Injectable()
export class LocaleService extends BaseService {
  constructor(private _http: Http, router: Router, private translateService: TranslateService) {
    super(_http, router);
  }

  initLocale() {
    let language = localStorage.getItem('locale');
    if (!language) {
      this.getDefaultLocale().subscribe((data => {
        language = data.model;
        localStorage.setItem('locale', language);
        this.translateService.setDefaultLang('en-US');
        this.translateService.use(language);
      }));
    } else {
      this.translateService.setDefaultLang('en-US');
      this.translateService.use(language);
    }
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

  getDefaultLocale(): Observable<OperationDataResult<any>> {
    return this.getWithOperationDataResult<any>(LocaleMethods.DefaultLocale);
  }
}
