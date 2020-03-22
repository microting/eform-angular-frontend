import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {InstalledPluginModel, InstalledPluginUpdateModel} from '../../../../../common/models/plugins-management';
import {InstalledPluginStatusEnum} from '../../../../../common/const';
import {PluginsManagementService} from '../../../../../common/services/plugins-management';

@Component({
  selector: 'app-installed-plugin-modal',
  templateUrl: './installed-plugin-modal.component.html',
  styleUrls: ['./installed-plugin-modal.component.scss']
})
export class InstalledPluginModalComponent implements OnInit {
  @Input() installedPluginModel: InstalledPluginModel = new InstalledPluginModel();
  @ViewChild(('frame'), {static: false}) frame;
  spinnerStatus = false;

  constructor(
    private pluginManagementService: PluginsManagementService) {}

  get statusEnum() {
    return InstalledPluginStatusEnum;
  }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  updatePluginStatus(status: number) {
    this.spinnerStatus = true;
    const newModel = new InstalledPluginUpdateModel();
    newModel.id = this.installedPluginModel.id;
    newModel.pluginId = this.installedPluginModel.pluginId;
    newModel.status = status === this.statusEnum.Enabled ? this.statusEnum.Disabled : this.statusEnum.Enabled;
    this.pluginManagementService.updateInstalledPlugin(newModel).subscribe((data) => {
      if (data && data.success) {
        // this.editInstalledPluginModal.hide();
        localStorage.removeItem('currentAuth');
        window.location.reload();
      }
      this.spinnerStatus = false;
    });
  }
}
