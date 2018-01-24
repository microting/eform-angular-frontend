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
    this.sort = '';
    this.nameFilter = '';
    this.pageSize = 10;
    this.pageIndex = 0;
    this.offset = 0;
  }
}
