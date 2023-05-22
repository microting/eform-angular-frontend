import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  PluginGroupPermissionsListModel,
  PluginGroupPermissionsUpdateModel,
  SecurityGroupModel,
} from 'src/app/common/models';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {PluginPermissionsService} from 'src/app/common/services';

@Component({
  selector: 'app-installed-plugin-permissions',
  templateUrl: './installed-plugin-permissions.component.html',
  styleUrls: ['./installed-plugin-permissions.component.scss'],
})
export class InstalledPluginPermissionsComponent implements OnInit {
  securityGroups: SecurityGroupModel[] = [];
  pluginGroupPermissions: PluginGroupPermissionsListModel[] = [];
  pluginId: number;

  constructor(
    private pluginPermissionsService: PluginPermissionsService,
    public dialogRef: MatDialogRef<InstalledPluginPermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) model: {pluginPermissions: PluginGroupPermissionsUpdateModel, securityGroups: SecurityGroupModel[]}) {
    this.pluginId = model.pluginPermissions.pluginId;
    this.pluginGroupPermissions = model.pluginPermissions.groupPermissions;
    this.securityGroups = model.securityGroups;
  }

  ngOnInit() {}

  hide(result = false) {
    this.dialogRef.close(result);
  }

  getSecurityGroupName(id: number) {
    const group = this.securityGroups.find((g) => g.id === id);
    return group ? group.groupName : '';
  }

  updatePluginPermissions() {
    this.pluginPermissionsService
      .updatePluginGroupPermissions({pluginId: this.pluginId, groupPermissions: this.pluginGroupPermissions})
      .subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
        }
      });
  }
}
