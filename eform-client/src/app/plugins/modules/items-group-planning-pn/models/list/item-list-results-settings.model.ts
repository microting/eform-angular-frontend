import {ItemListCasesPnRequestModel} from './item-list-cases-pn-request.model';

export class ItemListResultsPageModel {
  name: string;
  settings: ItemListCasesPnRequestModel = new ItemListCasesPnRequestModel();

  constructor(data?: any) {
    if (data) {
      this.name = data.name;
      this.settings = data.settings;
    }
  }
}

export class ItemListResultsSettingsModel {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  offset: number;
  listId: number;
  dateFrom: string;
  dateTo: string;

  constructor(data?: any) {
    if (data) {
      this.pageSize = data.pageSize;
      this.sort = data.sort;
      this.isSortDsc = data.isSortDsc;
      this.offset = data.offset;
      this.listId = data.listId;
      this.dateFrom = data.dateFrom;
      this.dateTo = data.dateTo;
    }
  }
}
