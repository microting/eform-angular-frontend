export class SortModel {
  sort: string;
  isSortDsc: boolean;
  constructor(sort?: string, isSortDsc?: boolean) {
    this.sort = sort ?? 'Id';
    this.isSortDsc = isSortDsc ?? false;
  }
}
