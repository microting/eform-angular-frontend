export class DashboardsRequestModel {
  searchString: string;

  sort: string;
  offset: number;
  pageSize: number;
  isSortDsc: boolean;

  constructor() {
    this.sort = 'Id';
    this.isSortDsc = true;
    this.pageSize = 10;
    this.offset = 0;
  }
}
