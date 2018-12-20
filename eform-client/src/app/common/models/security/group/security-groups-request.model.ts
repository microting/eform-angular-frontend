export class SecurityGroupsRequestModel {
  nameFilter: string;
  pageIndex: number;
  pageSize: number;
  isSortDsc: boolean;
  offset: number;

  constructor() {
    this.nameFilter = '';
    this.pageIndex = 1;
    this.pageSize = 5;
    this.isSortDsc = false;
    this.offset = 0;
  }
}
