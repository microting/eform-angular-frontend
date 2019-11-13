import {Component, OnInit, ViewChild} from '@angular/core';
import {
  InstalledPluginModel,
  InstalledPluginsModel,
  InstalledPluginsRequestModel,
  InstalledPluginUpdateModel
} from '../../../../../common/models/plugins-management';
import {InstalledPluginStatusEnum} from '../../../../../common/const';
import {PluginsManagementService} from '../../../../../common/services/plugins-management';

@Component({
  selector: 'app-installed-plugins-page',
  templateUrl: './installed-plugins-page.component.html',
  styleUrls: ['./installed-plugins-page.component.scss']
})
export class InstalledPluginsPageComponent implements OnInit {
  @ViewChild('editInstalledPluginModal', { static: true }) editInstalledPluginModal;
  installedPluginsRequestModel: InstalledPluginsRequestModel = new InstalledPluginsRequestModel();
  installedPluginsModel: InstalledPluginsModel = new InstalledPluginsModel();
  spinnerStatus = false;

  constructor(private pluginManagementService: PluginsManagementService) {
  }

  get statusEnum() {
    return InstalledPluginStatusEnum;
  }

  ngOnInit() {
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

  updateInstalledPlugin(model: InstalledPluginUpdateModel) {
    this.spinnerStatus = true;
    this.pluginManagementService.updateInstalledPlugin(model).subscribe((data) => {
      if (data && data.success) {
        this.editInstalledPluginModal.hide();
        window.location.reload();
      }
      this.spinnerStatus = false;
    });
  }
}
