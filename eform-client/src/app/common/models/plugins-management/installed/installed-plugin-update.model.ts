export class InstalledPluginUpdateModel {
  id: number;
  connectionString: string;
  status: number;
  pluginId: number;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.connectionString = data.connectionString;
      this.status = data.status;
      this.pluginId = data.pluginId;
    }
  }
}
