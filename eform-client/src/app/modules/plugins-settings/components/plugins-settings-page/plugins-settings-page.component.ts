import {Component, OnInit, ViewChild} from '@angular/core';
import {PluginsSettingsStatusEnum} from 'src/app/common/enums';
import {
  PluginSettingsModel,
  PluginsSettingsModel,
  PluginsSettingsRequestModel
} from 'src/app/common/models/settings/plugins';
import {PluginsSettingsService} from 'src/app/common/services/settings/plugins-settings';

@Component({
  selector: 'app-plugins-settings-page',
  templateUrl: './plugins-settings-page.component.html',
  styleUrls: ['./plugins-settings-page.component.scss']
})
export class PluginsSettingsPageComponent implements OnInit {
  @ViewChild('editPluginSettingsModal') editPluginSettingsModal;
  pluginsSettingsRequestModel: PluginsSettingsRequestModel = new PluginsSettingsRequestModel();
  pluginsSettingsModel: PluginsSettingsModel = new PluginsSettingsModel();
  spinnerStatus = false;

  constructor(private pluginsSettingsService: PluginsSettingsService) {
  }

  get statusEnum() {
    return PluginsSettingsStatusEnum;
  }

  ngOnInit() {
    this.getAllPlugins();
  }

  getAllPlugins() {
    this.spinnerStatus = true;
    this.pluginsSettingsService.getAllPluginsSettings(this.pluginsSettingsRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.pluginsSettingsModel = data.model;
      }
      this.spinnerStatus = false;
    });
  }

  showEditModal(pluginSettings: PluginSettingsModel) {
    this.editPluginSettingsModal.show(pluginSettings);
  }

}
