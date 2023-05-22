import {Component, Inject, OnInit} from '@angular/core';
import {
  InstalledPluginModel,
  InstalledPluginUpdateModel,
} from 'src/app/common/models';
import { InstalledPluginStatusEnum } from 'src/app/common/const';
import { PluginsManagementService } from 'src/app/common/services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-installed-plugin-modal',
  templateUrl: './installed-plugin-modal.component.html',
  styleUrls: ['./installed-plugin-modal.component.scss'],
})
export class InstalledPluginModalComponent implements OnInit {
  constructor(
    private pluginManagementService: PluginsManagementService,
    public dialogRef: MatDialogRef<InstalledPluginModalComponent>,
    @Inject(MAT_DIALOG_DATA) public installedPluginModel: InstalledPluginModel = new InstalledPluginModel()
  ) {}

  hide(result = false) {
    this.dialogRef.close(result);
  }

  get statusEnum() {
    return InstalledPluginStatusEnum;
  }

  ngOnInit() {}

  updatePluginStatus(status: number) {
    const newModel = new InstalledPluginUpdateModel();
    newModel.id = this.installedPluginModel.id;
    newModel.pluginId = this.installedPluginModel.pluginId;
    newModel.status = status;
    this.pluginManagementService
      .updateInstalledPlugin(newModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
          // window.location.reload();
        }
      });
  }
}
