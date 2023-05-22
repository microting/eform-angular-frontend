import {Component, Inject, OnInit,} from '@angular/core';
import {MarketplacePluginModel} from 'src/app/common/models';
import {PluginsManagementService} from 'src/app/common/services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-plugins-marketplace-install',
  templateUrl: './marketplace-plugin-install.component.html',
  styleUrls: ['./marketplace-plugin-install.component.scss']
})
export class MarketplacePluginInstallComponent implements OnInit {
  constructor(
    private pluginManagementService: PluginsManagementService,
    public dialogRef: MatDialogRef<MarketplacePluginInstallComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedPluginModel: MarketplacePluginModel = new MarketplacePluginModel(),) { }

  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }


  installPlugin() {
    this.pluginManagementService.installMarketplacePlugin(this.selectedPluginModel.pluginId).subscribe((data) => {
      if (data && data.success) {
        this.hide(true);
      }
    });
  }

}
