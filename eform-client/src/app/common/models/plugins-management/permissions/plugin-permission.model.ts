export class PluginPermissionModel {
  permissionId: number;
  permissionName: string;

  constructor(data?: any) {
    if (data) {
      this.permissionId = data.permissionId;
      this.permissionName = data.permissionName;
    }
  }
}
