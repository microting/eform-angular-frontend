export class TemplateRequestModel {
  public sort: string;
  nameFilter: string;
  tagIds: Array<number> = [];
  pageIndex: number;
  pageSize: number;
  isSortDsc: boolean;
  offset: number;

  constructor() {
    this.tagIds = [];
    this.sort = 'id';
    this.nameFilter = '';
    this.isSortDsc = true;
    this.pageSize = 10000;
    this.pageIndex = 0;
    this.offset = 0;
  }
}
