export class MarketplacePluginsRequestModel {
  sort: string;
  isSortDsc: boolean;

  constructor() {
    this.sort = 'id';
    this.isSortDsc = true;
  }
}
