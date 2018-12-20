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

  initLocalPageSettings(localStorageItemName: string, item: any) {
    if (!localStorage.getItem(localStorageItemName)) {
      localStorage.setItem(localStorageItemName, JSON.stringify(item));
    }
  }

  getLocalPageSettings(localStorageItemName: string, pageName?: string): ApplicationPageModel {
    const localPagesSettings = localStorage.getItem(localStorageItemName);
    if (pageName) {
      return <ApplicationPageModel> JSON.parse(localPagesSettings).find(x => x.name === pageName);
    }
    return <ApplicationPageModel> JSON.parse(localPagesSettings);
  }

  updateLocalPageSettings(localStorageItemName: string, model: PageSettingsModel, pageName?: string) {
    // Single or multiple pages choise
    if (pageName) {
      let localPagesSettings = <Array<ApplicationPageModel>> JSON.parse(localStorage.getItem(localStorageItemName));
      localPagesSettings[localPagesSettings.findIndex(x => x.name === pageName)].settings = model;
      localStorage.setItem(localStorageItemName, JSON.stringify(localPagesSettings));
    } else {
      let localPageSettings = <ApplicationPageModel> JSON.parse(localStorage.getItem(localStorageItemName));
      localPageSettings.settings = model;
      localStorage.setItem(localStorageItemName, JSON.stringify(localPageSettings));
    }
  }
}
