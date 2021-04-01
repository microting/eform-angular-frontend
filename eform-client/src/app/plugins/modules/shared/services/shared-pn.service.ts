import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPageModel, PageSettingsModel } from 'src/app/common/models';
import { BaseService } from 'src/app/common/services/base.service';

@Injectable()
export class SharedPnService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  initLocalPageSettings(localStorageItemName: string, item: any) {
    if (!localStorage.getItem(localStorageItemName)) {
      localStorage.setItem(localStorageItemName, JSON.stringify(item));
    }
  }

  getLocalPageSettings(
    localStorageItemName: string,
    pageName?: string
  ): ApplicationPageModel {
    const localPagesSettings = localStorage.getItem(localStorageItemName);
    let result;
    if (pageName) {
      const bla = JSON.parse(localPagesSettings);
      result = bla.find((x) => x.groupName === pageName);
      return <ApplicationPageModel>result;
    }
    return <ApplicationPageModel>JSON.parse(localPagesSettings);
  }

  updateLocalPageSettings(
    localStorageItemName: string,
    model: PageSettingsModel,
    pageName?: string
  ) {
    // Single or multiple pages choise
    if (pageName) {
      const localPagesSettings = <Array<ApplicationPageModel>>(
        JSON.parse(localStorage.getItem(localStorageItemName))
      );
      localPagesSettings[
        localPagesSettings.findIndex((x) => x.name === pageName)
      ].settings = model;
      localStorage.setItem(
        localStorageItemName,
        JSON.stringify(localPagesSettings)
      );
    } else {
      const localPageSettings = <ApplicationPageModel>(
        JSON.parse(localStorage.getItem(localStorageItemName))
      );
      localPageSettings.settings = model;
      localStorage.setItem(
        localStorageItemName,
        JSON.stringify(localPageSettings)
      );
    }
  }
}
