import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PluginsSettingsStatusEnum} from 'src/app/common/enums';
import {PluginSettingsModel, PluginsSettingsUpdateModel} from 'src/app/common/models/settings/plugins';
import {PluginsSettingsService} from 'src/app/common/services/settings/plugins-settings';

@Component({
  selector: 'app-plugins-settings-edit',
  templateUrl: './plugin-settings-edit.component.html',
  styleUrls: ['./plugin-settings-edit.component.scss']
})
export class PluginSettingsEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onPluginSettingsUpdated: EventEmitter<void> = new EventEmitter();
  selectedPluginSettings: PluginSettingsModel = new PluginSettingsModel();
  pluginSettingsUpdateModel: PluginsSettingsUpdateModel = new PluginsSettingsUpdateModel();
  spinnerStatus = false;

  get statusEnum() {
    return PluginsSettingsStatusEnum;
  }

  constructor(private pluginSettingsService: PluginsSettingsService) {
  }

  ngOnInit() {
  }

  show(model: PluginSettingsModel) {
    this.selectedPluginSettings = model;
    this.pluginSettingsUpdateModel = new PluginsSettingsUpdateModel(this.selectedPluginSettings);
    this.frame.show();
  }

  updateSettings() {
    this.spinnerStatus = true;
    this.pluginSettingsService.updatePluginSettings(this.pluginSettingsUpdateModel).subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.onPluginSettingsUpdated.emit();
        this.pluginSettingsUpdateModel = new PluginsSettingsUpdateModel();
        window.location.reload();
      }
      this.spinnerStatus = false;
    });
  }

}
