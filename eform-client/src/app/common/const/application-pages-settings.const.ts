import { ApplicationPages } from 'src/app/common/const/enums/application-pages.enum';
import {
  ApplicationPageModel,
  PageSettingsModel,
} from 'src/app/common/models/settings/application-page-settings.model';

export const ApplicationPagesSettings = [
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
    name: ApplicationPages[ApplicationPages.EntitySelect],
    index: ApplicationPages.EntitySelect,
    settings: new PageSettingsModel({
      pageSize: 10,
      sort: 'id',
      isSortDsc: false,
    }),
  }),
];
