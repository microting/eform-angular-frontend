export class PluginPermissionModel {
  permissionId: number;
  name: string;

  constructor(data?: any) {
    if (data) {
      this.permissionId = data.permissionId;
      this.name = data.name;
    }
  }
}
