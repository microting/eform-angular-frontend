import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PluginGroupPermissionsListModel} from '../../../../../common/models/plugins-management';
import {SecurityGroupModel} from '../../../../../common/models/security/group';

@Component({
  selector: 'app-installed-plugin-permissions',
  templateUrl: './installed-plugin-permissions.component.html',
  styleUrls: ['./installed-plugin-permissions.component.scss']
})
export class InstalledPluginPermissionsComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() pluginPermissionsUpdate: EventEmitter<PluginGroupPermissionsListModel[]> = new EventEmitter();
  @Input() securityGroups: SecurityGroupModel[] = [];
  pluginGroupPermissions: PluginGroupPermissionsListModel[] = [];
  spinnerStatus = false;

  constructor() { }

  ngOnInit() {
  }

  show(list: PluginGroupPermissionsListModel[]) {
    this.pluginGroupPermissions = list;
    this.frame.show();
  }

  hide() { this.frame.hide(); }

  updatePermissions() {
    this.pluginPermissionsUpdate.emit(this.pluginGroupPermissions);
  }

  getSecurityGroupName(id: number) {
    const group = this.securityGroups.find(g => g.id === id);
    return group ? group.name : '';
  }
}
