import {Component, OnInit, ViewChild} from '@angular/core';
import {
  InstalledPluginModel,
  InstalledPluginsModel,
  InstalledPluginsRequestModel,
  InstalledPluginUpdateModel, PluginGroupPermissionsListModel, PluginGroupPermissionsUpdateModel
} from '../../../../../common/models/plugins-management';
import {InstalledPluginStatusEnum} from '../../../../../common/const';
import {PluginPermissionsService, PluginsManagementService} from '../../../../../common/services/plugins-management';
import {SecurityGroupsService} from '../../../../../common/services/security';
import {SecurityGroupModel, SecurityGroupsRequestModel} from '../../../../../common/models/security/group';

@Component({
  selector: 'app-installed-plugins-page',
  templateUrl: './installed-plugins-page.component.html',
  styleUrls: ['./installed-plugins-page.component.scss']
})
export class InstalledPluginsPageComponent implements OnInit {
  @ViewChild('installedPluginModal', { static: true }) installedPluginModal;
  // @ViewChild('editInstalledPluginModal') editInstalledPluginModal;
  @ViewChild('editPluginPermissionsModal', { static: true }) editPluginPermissionsModal;
  @ViewChild('editInstalledPluginModal', { static: true }) editInstalledPluginModal;
  installedPluginsRequestModel: InstalledPluginsRequestModel = new InstalledPluginsRequestModel();
  installedPluginsModel: InstalledPluginsModel = new InstalledPluginsModel();
  securityGroups: SecurityGroupModel[] = [];
  pluginSettingsUpdateModel: InstalledPluginUpdateModel = new InstalledPluginUpdateModel();

  constructor(
    private pluginManagementService: PluginsManagementService,
    private pluginPermissionsService: PluginPermissionsService,
    private securityGroupsService: SecurityGroupsService
  ) { }

  get statusEnum() {
    return InstalledPluginStatusEnum;
  }

  ngOnInit() {
    this.securityGroupsService.getAllSecurityGroups(new SecurityGroupsRequestModel()).subscribe(data => {
      if (data && data.success) {
        this.securityGroups = data.model.securityGroupList;
      }
    });

    this.getInstalledPlugins();
  }

  getInstalledPlugins() {
    this.pluginManagementService.getInstalledPlugins(this.installedPluginsRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.installedPluginsModel = data.model;
      }
    });
  }

  openPluginModal(installedPlugin: InstalledPluginModel, status: number) {
    this.pluginSettingsUpdateModel.status = status;
    this.installedPluginModal.installedPluginModel = installedPlugin;
    this.installedPluginModal.show();
  }

  // showEditModal(installedPlugin: InstalledPluginModel) {
  //   this.editInstalledPluginModal.show(installedPlugin);
  // }

  showPermissionsModal(installedPlugin: InstalledPluginModel) {
    this.pluginPermissionsService.getPluginPermissions(installedPlugin.id).subscribe(data => {
      if (data && data.success) {
        this.pluginPermissionsService.getPluginGroupPermissions(installedPlugin.id).subscribe(groupData => {
          if (groupData && groupData.success) {
            for (const securityGroup of this.securityGroups) {
              if (!groupData.model.some(p => p.groupId === securityGroup.id)) {
                groupData.model.push(
                  new PluginGroupPermissionsListModel(
                    {groupId: securityGroup.id, permissions: data.model.map(p => ({...p}))}
                  )
                );
              }
            }
          }

          this.editPluginPermissionsModal.show({pluginId: installedPlugin.id, groupPermissions: groupData.model});
        });
      }
    });
  }

  // updateInstalledPlugin(model: InstalledPluginModel, status: number) {
  //
  // }

  updatePluginPermissions(model: PluginGroupPermissionsUpdateModel) {
    this.pluginPermissionsService.updatePluginGroupPermissions(model).subscribe((data) => {
      if (data && data.success) {
        this.editPluginPermissionsModal.hide();
      }
    });
  }

  // updateSettings() {
  //   this.pluginSettingsUpdateModel.statusChanged = this.statusChanged;
  //   this.onInstalledPluginUpdate.emit(this.pluginSettingsUpdateModel);
  // }
}
