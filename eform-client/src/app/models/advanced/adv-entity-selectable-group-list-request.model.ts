export class AdvEntitySelectableGroupListRequestModel {
  public sort: string;
  nameFilter: string;
  pageIndex: number;
  pageSize: number;
  isSortDsc: boolean;
  offset: number;

  constructor() {
    this.sort = '';
    this.nameFilter = '';
    this.pageSize = 10;
    this.pageIndex = 0;
    this.offset = 0;
  }
}
