import {Component, OnInit, inject} from '@angular/core';
import {
  PluginGroupPermissionsListModel,
  PluginGroupPermissionsUpdateModel,
  SecurityGroupModel,
} from 'src/app/common/models';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PluginPermissionsService} from 'src/app/common/services';

@Component({
  selector: 'app-installed-plugin-permissions',
  templateUrl: './installed-plugin-permissions.component.html',
  styleUrls: ['./installed-plugin-permissions.component.scss'],
  standalone: false,
})

export class InstalledPluginPermissionsComponent implements OnInit {
  private pluginPermissionsService = inject(PluginPermissionsService);
  private fb = inject(FormBuilder);
  dialogRef = inject<MatDialogRef<InstalledPluginPermissionsComponent>>(MatDialogRef);

  securityGroups: SecurityGroupModel[] = [];
  pluginGroupPermissions: PluginGroupPermissionsListModel[] = [];
  pluginId: number;
  permissionsForm: FormGroup = this.fb.group({});

  constructor() {
    const model = inject<{
      pluginPermissions: PluginGroupPermissionsUpdateModel;
      securityGroups: SecurityGroupModel[];
    }>(MAT_DIALOG_DATA);

    this.pluginId = model.pluginPermissions.pluginId;
    this.pluginGroupPermissions = model.pluginPermissions.groupPermissions;
    this.securityGroups = model.securityGroups;
  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    const controls: { [key: string]: FormControl } = {};

    this.pluginGroupPermissions.forEach(group => {
      group.permissions.forEach(permission => {
        const controlName = this.getPermissionControlName(group.groupId, permission.permissionId);
        controls[controlName] = new FormControl(permission.isEnabled);
      });
    });

    this.permissionsForm = this.fb.group(controls);
  }

  getPermissionControlName(groupId: number, permissionId: number): string {
    return `perm_${groupId}_${permissionId}`;
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  getSecurityGroupName(id: number) {
    const group = this.securityGroups.find(g => g.id === id);
    return group ? group.groupName : '';
  }

  updatePluginPermissions() {

    this.pluginGroupPermissions.forEach(group => {
      group.permissions.forEach(permission => {
        const controlName = this.getPermissionControlName(group.groupId, permission.permissionId);
        permission.isEnabled = this.permissionsForm.get(controlName)?.value ?? false;
      });
    });

    this.pluginPermissionsService
      .updatePluginGroupPermissions({
        pluginId: this.pluginId,
        groupPermissions: this.pluginGroupPermissions,
      })
      .subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
        }
      });
  }
}
