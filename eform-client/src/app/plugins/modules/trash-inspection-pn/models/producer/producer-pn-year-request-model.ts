export class ProducerPnYearRequestModel {
  sort: string;
  isSortDsc: boolean;
  year: number;

  constructor() {
    this.sort = 'Id';
    this.isSortDsc = true;
  }
}
