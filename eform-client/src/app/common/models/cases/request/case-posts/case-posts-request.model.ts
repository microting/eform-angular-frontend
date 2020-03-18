export class CasePostsRequest {
  public sort: string;
  pageIndex: number;
  pageSize: number;
  isSortDsc: boolean;
  offset: number;
  templateId: number;
  caseId: number;

  constructor() {
    this.sort = 'id';
    this.isSortDsc = true;
    this.pageSize = 1000;
    this.pageIndex = 0;
    this.offset = 0;
  }
}
