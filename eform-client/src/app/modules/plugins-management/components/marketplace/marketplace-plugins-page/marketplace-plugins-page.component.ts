import {Component, OnInit, ViewChild} from '@angular/core';
import {PluginsManagementService} from '../../../../../common/services/plugins-management';
import {
  MarketplacePluginModel,
  MarketplacePluginsRequestModel
} from '../../../../../common/models/plugins-management';
import {InstalledPluginStatusEnum} from '../../../../../common/enums';

@Component({
  selector: 'app-plugins-marketplace-page',
  templateUrl: './marketplace-plugins-page.component.html',
  styleUrls: ['./marketplace-plugins-page.component.scss']
})
export class MarketplacePluginsPageComponent implements OnInit {
  @ViewChild('installMarketplacePluginModal') installMarketplacePluginModal;
  marketplacePluginsRequestModel: MarketplacePluginsRequestModel = new MarketplacePluginsRequestModel();
  marketplacePluginsList: Array<MarketplacePluginModel> = [];
  spinnerStatus = false;

  constructor(private pluginManagementService: PluginsManagementService) {
  }

  ngOnInit() {
    this.getMarketplacePlugins();
  }

  getMarketplacePlugins() {
    this.spinnerStatus = true;
    this.pluginManagementService.getMarketplacePlugins(this.marketplacePluginsRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.marketplacePluginsList = data.model;
      }
      this.spinnerStatus = false;
    });
  }

  showEditModal(marketplacePlugin: MarketplacePluginModel) {
    this.installMarketplacePluginModal.show(marketplacePlugin);
  }

  installPlugin(model: MarketplacePluginModel) {
    this.spinnerStatus = true;
    this.pluginManagementService.installMarketplacePlugin(model.id).subscribe((data) => {
      if (data && data.success) {
        this.installMarketplacePluginModal.hide();
      }
      this.spinnerStatus = false;
    });
  }
}
