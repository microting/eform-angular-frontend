export class FractionPnYearRequestModel {
  sort: string;
  isSortDsc: boolean;
  year: number;

  constructor() {
    this.sort = 'Name';
    this.isSortDsc = true;
  }
}
