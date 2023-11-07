export class CasesRequestModel {
  public sort: string;
  public nameFilter: string;
  public pageSize: number;
  public isSortDsc: boolean;
  public offset: number;
  public templateId: number;

  constructor() {
    this.sort = 'id';
    this.nameFilter = '';
    this.isSortDsc = true;
    this.pageSize = 1000;
    this.offset = 0;
    this.templateId = 0;
  }
}
