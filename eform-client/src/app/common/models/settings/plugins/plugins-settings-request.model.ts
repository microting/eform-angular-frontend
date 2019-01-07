export class PluginsSettingsRequestModel {
  sort: string;
  pageIndex: number;
  pageSize: number;
  isSortDsc: boolean;
  offset: number;

  constructor() {
    this.sort = 'id';
    this.isSortDsc = true;
    this.pageSize = 1000;
    this.pageIndex = 0;
    this.offset = 0;
  }
}
