export class EmailRecipientsRequestModel {
  public sort: string;
  pageIndex: number;
  pageSize: number;
  isSortDsc: boolean;
  offset: number;
  tagIds: number[];

  constructor() {
    this.sort = 'id';
    this.isSortDsc = true;
    this.pageSize = 10;
    this.pageIndex = 0;
    this.offset = 0;
    this.tagIds = [];
  }
}
