import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
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
              private translateService: TranslateService) {
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
      });
    } else {
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


}
