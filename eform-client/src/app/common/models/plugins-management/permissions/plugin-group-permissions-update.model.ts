import {PluginGroupPermissionsListModel} from './plugin-group-permissions.model';

export class PluginGroupPermissionsUpdateModel {
  pluginId: number;
  groupPermissions: PluginGroupPermissionsListModel[];

  constructor(data?: any) {
    if (data) {
      this.pluginId = data.pluginId;
      this.groupPermissions = data.permissions;
    }
  }
}
