import { ApplicationPages } from 'src/app/common/const/enums/application-pages.enum';
import {
  ApplicationPageModel,
  PageSettingsModel,
} from 'src/app/common/models/settings/application-page-settings.model';

export const ApplicationPagesSettings = [
  // new ApplicationPageModel({
  //   name: ApplicationPages[ApplicationPages.Eforms],
  //   index: ApplicationPages.Eforms,
  //   settings: new PageSettingsModel({
  //     pageSize: 1000000,
  //     sort: 'id',
  //     isSortDsc: false,
  //   }),
  // }),
  new ApplicationPageModel({
    name: ApplicationPages[ApplicationPages.DeviceUsers],
    index: ApplicationPages.DeviceUsers,
    settings: new PageSettingsModel({
      pageSize: 10,
    }),
  }),
  new ApplicationPageModel({
    name: ApplicationPages[ApplicationPages.Cases],
    index: ApplicationPages.Cases,
    settings: new PageSettingsModel({
      pageSize: 10,
    }),
  }),
  new ApplicationPageModel({
    name: ApplicationPages[ApplicationPages.CasePosts],
    index: ApplicationPages.CasePosts,
    settings: new PageSettingsModel({
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
    }),
  }),
  new ApplicationPageModel({
    name: ApplicationPages[ApplicationPages.AccountManagementUsers],
    index: ApplicationPages.AccountManagementUsers,
    settings: new PageSettingsModel({
      pageSize: 10,
    }),
  }),
  new ApplicationPageModel({
    name: ApplicationPages[ApplicationPages.Security],
    index: ApplicationPages.Security,
    settings: new PageSettingsModel({
      pageSize: 10,
    }),
  }),
  // new ApplicationPageModel({
  //     name: ApplicationPages[ApplicationPages.EntitySearch],
  //     index: ApplicationPages.EntitySearch,
  //     settings: new PageSettingsModel({
  //       pageSize: 10,
  //       sort: 'id',
  //       isSortDsc: false
  //     })
  //   }
  // ),
  new ApplicationPageModel({
    name: ApplicationPages[ApplicationPages.EntitySelect],
    index: ApplicationPages.EntitySelect,
    settings: new PageSettingsModel({
      pageSize: 10,
      sort: 'id',
      isSortDsc: false,
    }),
  }),
  new ApplicationPageModel({
    name: ApplicationPages[ApplicationPages.PluginsSettings],
    index: ApplicationPages.PluginsSettings,
    settings: new PageSettingsModel({
      pageSize: 10,
      sort: 'id',
      isSortDsc: false,
    }),
  }),
  new ApplicationPageModel({
    name: ApplicationPages[ApplicationPages.EmailRecipients],
    index: ApplicationPages.EmailRecipients,
    settings: new PageSettingsModel({
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
    }),
  }),
];
