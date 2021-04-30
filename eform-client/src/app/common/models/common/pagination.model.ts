export class PaginationModel {
  total: number;
  pageSize: number;
  offset: number;

  constructor(total?, pageSize?, offset?) {
    this.pageSize = pageSize;
    this.total = total;
    this.offset = offset;
  }
}
