export class ItemsListPnRequestModel {
  pageSize: number;
  sort: string;
  pageIndex: number;
  isSortDsc: boolean;
  offset: number;
  nameFilter: string;

  constructor() {
    this.sort = 'Id';
    this.isSortDsc = true;
    this.pageSize = 10;
    this.pageIndex = 1;
    this.offset = 0;
    this.nameFilter = '';
  }
}
