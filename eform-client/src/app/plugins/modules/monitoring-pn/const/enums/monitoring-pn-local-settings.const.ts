import {
  ApplicationPageModel,
  PageSettingsModel
} from 'src/app/common/models/settings';

export const MonitoringPnLocalSettings = [
  new ApplicationPageModel({
      name: 'NotificationRules',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    }
  )
];

