export class ApplicationPageModel {
  name: string;
  settings: PageSettingsModel = new PageSettingsModel();

  constructor(data?: any) {
    if (data) {
      this.name = data.name;
      this.settings = data.settings;
    }
  }
}

export class PageSettingsModel {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  additional: Array<{ key: string; value: string }> = [];

  constructor(data?: any) {
    if (data) {
      this.pageSize = data.pageSize;
      this.sort = data.sort;
      this.isSortDsc = data.isSortDsc;
    }
  }
}
