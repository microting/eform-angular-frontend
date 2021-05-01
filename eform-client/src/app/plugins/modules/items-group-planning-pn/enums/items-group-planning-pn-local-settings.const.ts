import {
  ApplicationPageModel,
  PageSettingsModel
} from 'src/app/common/models/settings';
import {ItemListResultsPageModel, ItemListResultsSettingsModel} from '../models/list';
import {ItemListCasesPnRequestModel} from '../models/list/item-list-cases-pn-request.model';

export const ItemsGroupPlanningPnLocalSettings = [
  new ApplicationPageModel({
      name: 'ItemLists',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    },
  ),
  new ApplicationPageModel({
      name: 'ItemListCases',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    },
  ),
  new ItemListResultsPageModel({
      name: 'ItemCaseResults',
      settings: {
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false,
        pageIndex: 1,
        offset: 0,
        listId: 0,
        dateFrom: '',
        dateTo: ''
      }
    },
  )
];

