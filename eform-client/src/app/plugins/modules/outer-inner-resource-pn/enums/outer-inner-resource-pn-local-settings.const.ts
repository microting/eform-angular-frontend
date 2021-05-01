import {
  ApplicationPageModel,
  PageSettingsModel
} from 'src/app/common/models/settings';

export const OuterInnerResourcePnLocalSettings = [
  new ApplicationPageModel({
      name: 'Areas',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    }
  ),
  new ApplicationPageModel({
      name: 'InnerResources',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    }
  )
];

