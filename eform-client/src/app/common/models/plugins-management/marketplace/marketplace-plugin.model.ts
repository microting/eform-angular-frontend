export class MarketplacePluginModel {
  pluginId: string;
  name: string;
}

export class MarketplacePluginsModel {
  total: number;
  pluginsList: Array<MarketplacePluginModel> = [];
}


