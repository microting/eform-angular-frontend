import {
  ApplicationPageModel,
  PageSettingsModel,
} from 'src/app/common/models/settings';

export const TrashInspectionPnLocalSettings = [
  new ApplicationPageModel({
    name: 'Transporters',
    settings: new PageSettingsModel({
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
    }),
  }),
  new ApplicationPageModel({
    name: 'Producers',
    settings: new PageSettingsModel({
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
    }),
  }),
];
