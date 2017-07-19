export class PaginationModel {
  pageIndex: number = 1;
  pageSize: 10;
  offset: 0;

  constructor(pageIndex?, pageSize?, offset?) {
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.offset = offset;
  }
}
