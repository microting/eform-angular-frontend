export class ProducerPnRequestModel {
  pageSize: number;
  nameFilter: string;
  sort: string;
  pageIndex: number;
  isSortDsc: boolean;
  offset: number;

  constructor() {
    this.sort = 'Id';
    this.isSortDsc = true;
    this.pageSize = 10;
    this.pageIndex = 1;
    this.offset = 0;
  }
}
