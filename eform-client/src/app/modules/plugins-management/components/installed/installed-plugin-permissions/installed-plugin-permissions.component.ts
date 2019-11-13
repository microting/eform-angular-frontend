import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PluginGroupPermissionsListModel, PluginGroupPermissionsUpdateModel} from '../../../../../common/models/plugins-management';
import {SecurityGroupModel} from '../../../../../common/models/security/group';

@Component({
  selector: 'app-installed-plugin-permissions',
  templateUrl: './installed-plugin-permissions.component.html',
  styleUrls: ['./installed-plugin-permissions.component.scss']
})
export class InstalledPluginPermissionsComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() pluginPermissionsUpdate: EventEmitter<PluginGroupPermissionsUpdateModel> = new EventEmitter();
  @Input() securityGroups: SecurityGroupModel[] = [];
  pluginGroupPermissions: PluginGroupPermissionsListModel[] = [];
  pluginId: number;
  spinnerStatus = false;

  constructor() { }

  ngOnInit() {
  }

  show(model: PluginGroupPermissionsUpdateModel) {
    this.pluginId = model.pluginId;
    this.pluginGroupPermissions = model.groupPermissions;
    this.frame.show();
  }

  hide() { this.frame.hide(); }

  updatePermissions() {
    this.pluginPermissionsUpdate.emit({pluginId: this.pluginId, groupPermissions: this.pluginGroupPermissions});
  }

  getSecurityGroupName(id: number) {
    const group = this.securityGroups.find(g => g.id === id);
    return group ? group.name : '';
  }
}
