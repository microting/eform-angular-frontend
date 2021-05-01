import {
  ApplicationPageModel,
  PageSettingsModel
} from 'src/app/common/models/settings/application-page-settings.model';

export const CustomersPnLocalSettings =
  new ApplicationPageModel({
      name: 'CustomersPn',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: '',
        isSortDsc: false
      })
    }
  );
