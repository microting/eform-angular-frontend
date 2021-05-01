export class CustomersPnRequestModel {
  name: string;
  sortColumnName: string;
  pageIndex: number;
  offset: number;
  pageSize: number;
  isSortDsc: boolean;

  constructor() {
    this.sortColumnName = 'Id';
    this.isSortDsc = true;
    this.pageSize = 5;
    this.pageIndex = 1;
    this.offset = 0;
  }
}
