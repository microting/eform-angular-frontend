import {PluginPermissionModel} from './plugin-permission.model';

export class PluginGroupPermissionsListModel {
  groupId: number;
  permissions: PluginGroupPermissionsModel[];

  constructor(data?: any) {
    if (data) {
      this.permissions = data.permissions;
      this.groupId = data.groupId;
    }
  }
}

export class PluginGroupPermissionsModel extends PluginPermissionModel {
  isEnabled = false;

  constructor(data?: any) {
    super(data);
    if (data) {
      this.isEnabled = data.isEnabled;
    }
  }
}
