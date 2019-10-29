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
  @ViewChild('editInstalledPluginModal') editInstalledPluginModal;
  @ViewChild('editPluginPermissionsModal') editPluginPermissionsModal;
  installedPluginsRequestModel: InstalledPluginsRequestModel = new InstalledPluginsRequestModel();
  installedPluginsModel: InstalledPluginsModel = new InstalledPluginsModel();
  securityGroups: SecurityGroupModel[] = [];
  spinnerStatus = false;

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
    this.spinnerStatus = true;
    this.pluginManagementService.getInstalledPlugins(this.installedPluginsRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.installedPluginsModel = data.model;
      }
      this.spinnerStatus = false;
    });
  }

  showEditModal(installedPlugin: InstalledPluginModel) {
    this.editInstalledPluginModal.show(installedPlugin);
  }

  showPermissionsModal(installedPlugin: InstalledPluginModel) {
    this.spinnerStatus = true;
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
          this.spinnerStatus = false;
        });
      }
    });
  }

  updateInstalledPlugin(model: InstalledPluginUpdateModel) {
    this.spinnerStatus = true;
    this.pluginManagementService.updateInstalledPlugin(model).subscribe((data) => {
      if (data && data.success) {
        this.editInstalledPluginModal.hide();
        localStorage.removeItem('currentAuth');
        window.location.reload();
      }
      this.spinnerStatus = false;
    });
  }

  updatePluginPermissions(model: PluginGroupPermissionsUpdateModel) {
    this.spinnerStatus = true;
    this.pluginPermissionsService.updatePluginGroupPermissions(model).subscribe((data) => {
      if (data && data.success) {
        this.editPluginPermissionsModal.hide();
      }
      this.spinnerStatus = false;
    });
  }
}
