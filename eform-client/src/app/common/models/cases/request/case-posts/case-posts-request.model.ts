export class CasePostsRequestModel {
  public sort: string;
  pageSize: number;
  isSortDsc: boolean;
  offset: number;
  templateId: number;
  caseId: number;

  constructor() {
    this.sort = 'id';
    this.isSortDsc = true;
    this.pageSize = 1000;
    this.offset = 0;
  }
}
