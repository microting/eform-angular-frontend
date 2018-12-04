import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {
  ApplicationPageModel,
  PageSettingsModel
} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

@Injectable()
export class SharedPnService extends BaseService {
  constructor(private _http: HttpClient, router: Router,
              toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  initLocalPageSettings(localStorageItemName: string, item: ApplicationPageModel) {
    if (!localStorage.getItem(localStorageItemName)) {
      localStorage.setItem(localStorageItemName, JSON.stringify(item));
    }
  }

  getLocalPageSettings(localStorageItemName: string): ApplicationPageModel {
    const localPagesSettings = localStorage.getItem(localStorageItemName);
    return <ApplicationPageModel> JSON.parse(localPagesSettings);
  }

  updateLocalPageSettings(localStorageItemName: string, model: PageSettingsModel) {
    const localPagesSettings = <ApplicationPageModel> JSON.parse(localStorage.getItem(localStorageItemName));
    localPagesSettings.settings = model;
    localStorage.setItem(localStorageItemName, JSON.stringify(localPagesSettings));
  }
}
