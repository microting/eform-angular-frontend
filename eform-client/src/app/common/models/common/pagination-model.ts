export class PaginationModel {
  pageIndex: number;
  pageSize: number;
  offset: number;

  constructor(pageIndex?, pageSize?, offset?) {
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.offset = offset;
  }
}
