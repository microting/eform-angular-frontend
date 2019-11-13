import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {InstalledPluginModel, InstalledPluginUpdateModel} from '../../../../../common/models/plugins-management';
import {InstalledPluginStatusEnum} from '../../../../../common/const';
import {PluginsManagementService} from '../../../../../common/services/plugins-management';

@Component({
  selector: 'app-installed-plugin-edit',
  templateUrl: './installed-plugin-edit.component.html',
  styleUrls: ['./installed-plugin-edit.component.scss']
})
export class InstalledPluginEditComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() onInstalledPluginUpdate: EventEmitter<InstalledPluginUpdateModel> = new EventEmitter();
  selectedPluginSettings: InstalledPluginModel = new InstalledPluginModel();
  pluginSettingsUpdateModel: InstalledPluginUpdateModel = new InstalledPluginUpdateModel();
  spinnerStatus = false;

  get statusEnum() {
    return InstalledPluginStatusEnum;
  }

  get statusChanged() {
    return this.selectedPluginSettings.status !== this.pluginSettingsUpdateModel.status;
  }

  constructor(private pluginSettingsService: PluginsManagementService) {
  }

  ngOnInit() {
  }

  show(model: InstalledPluginModel) {
    this.selectedPluginSettings = model;
    this.pluginSettingsUpdateModel = new InstalledPluginUpdateModel(this.selectedPluginSettings);

    this.frame.show();
  }

  hide() { this.frame.hide(); }

  updateSettings() {
    this.pluginSettingsUpdateModel.statusChanged = this.statusChanged;
    this.onInstalledPluginUpdate.emit(this.pluginSettingsUpdateModel);
  }

}
