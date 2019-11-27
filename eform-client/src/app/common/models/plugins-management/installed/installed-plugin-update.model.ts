export class InstalledPluginUpdateModel {
  id: number;
  // connectionString: string;
  status: number;
  pluginId: number;
  statusChanged = false;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      // this.connectionString = data.connectionString;
      this.status = data.status;
      this.pluginId = data.pluginId;
    }
  }
}
