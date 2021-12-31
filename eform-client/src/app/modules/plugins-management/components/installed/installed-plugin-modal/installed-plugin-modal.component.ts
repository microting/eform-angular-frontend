import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  InstalledPluginModel,
  InstalledPluginUpdateModel,
} from '../../../../../common/models';
import { InstalledPluginStatusEnum } from 'src/app/common/const';
import { PluginsManagementService } from 'src/app/common/services';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-installed-plugin-modal',
  templateUrl: './installed-plugin-modal.component.html',
  styleUrls: ['./installed-plugin-modal.component.scss'],
})
export class InstalledPluginModalComponent implements OnInit {
  @Input()
  installedPluginModel: InstalledPluginModel = new InstalledPluginModel();
  @ViewChild('frame') frame;

  constructor(
    private authStateService: AuthStateService,
    private pluginManagementService: PluginsManagementService
  ) {}

  get statusEnum() {
    return InstalledPluginStatusEnum;
  }

  ngOnInit() {}

  show() {
    this.frame.show();
  }

  updatePluginStatus(status: number) {
    const newModel = new InstalledPluginUpdateModel();
    newModel.id = this.installedPluginModel.id;
    newModel.pluginId = this.installedPluginModel.pluginId;
    newModel.status =
      status === this.statusEnum.Enabled
        ? this.statusEnum.Disabled
        : this.statusEnum.Enabled;
    this.pluginManagementService
      .updateInstalledPlugin(newModel)
      .subscribe((data) => {
        if (data && data.success) {
          // this.editInstalledPluginModal.hide();
          this.authStateService.logout();
          // window.location.reload();
        }
      });
  }
}
