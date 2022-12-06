import { Injectable } from '@angular/core';
import { ApplicationPageModel, PageSettingsModel } from 'src/app/common/models';

@Injectable()
export class SharedPnService {
  constructor() {}

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
      result = JSON.parse(localPagesSettings).find((x) => x.name === pageName);
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
