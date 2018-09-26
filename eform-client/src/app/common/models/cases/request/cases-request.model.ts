export class CasesRequestModel {
  public sort: string;
  nameFilter: string;
  pageIndex: number;
  pageSize: number;
  isSortDsc: boolean;
  offset: number;
  templateId: number;

  constructor() {
    this.sort = 'id';
    this.nameFilter = '';
    this.isSortDsc = true;
    this.pageSize = 1000;
    this.pageIndex = 0;
    this.offset = 0;
  }
}
