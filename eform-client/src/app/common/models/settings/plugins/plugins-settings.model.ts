export class PluginsSettingsModel {
  total: number;
  settingsList: Array<PluginSettingsModel> = [];
}

export class PluginSettingsModel {
  id: number;
  name: string;
  version: string;
  status: number;
  connectionString: string;
}
