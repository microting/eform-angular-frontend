export class TransporterYearPnRequestModel {
  sort: string;
  isSortDsc: boolean;
  year: number;

  constructor() {
    this.sort = 'Name';
    this.isSortDsc = true;
  }
}
