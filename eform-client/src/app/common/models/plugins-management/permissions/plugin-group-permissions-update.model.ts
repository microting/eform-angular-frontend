import {PluginGroupPermissionsListModel} from 'src/app/common/models';

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
