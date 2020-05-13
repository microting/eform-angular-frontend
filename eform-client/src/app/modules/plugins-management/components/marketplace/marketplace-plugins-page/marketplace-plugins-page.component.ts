import {Component, OnInit, ViewChild} from '@angular/core';
import {PluginsManagementService} from '../../../../../common/services/plugins-management';
import {
  MarketplacePluginModel, MarketplacePluginsModel,
  MarketplacePluginsRequestModel
} from 'src/app/common/models/plugins-management';

@Component({
  selector: 'app-plugins-marketplace-page',
  templateUrl: './marketplace-plugins-page.component.html',
  styleUrls: ['./marketplace-plugins-page.component.scss']
})
export class MarketplacePluginsPageComponent implements OnInit {
  @ViewChild('installMarketplacePluginModal', { static: true }) installMarketplacePluginModal;
  marketplacePluginsRequestModel: MarketplacePluginsRequestModel = new MarketplacePluginsRequestModel();
  marketplacePluginsList: MarketplacePluginsModel = new MarketplacePluginsModel();

  constructor(private pluginManagementService: PluginsManagementService) {
  }

  ngOnInit() {
    this.getMarketplacePlugins();
  }

  getMarketplacePlugins() {
    this.pluginManagementService.getMarketplacePlugins(this.marketplacePluginsRequestModel)
      .subscribe((data) => {
      if (data && data.success) {
        this.marketplacePluginsList = data.model;
      }
    });
  }

  showEditModal(marketplacePlugin: MarketplacePluginModel) {
    this.installMarketplacePluginModal.show(marketplacePlugin);
  }

  installPlugin(model: MarketplacePluginModel) {
    this.pluginManagementService.installMarketplacePlugin(model.pluginId).subscribe((data) => {
      if (data && data.success) {
        this.installMarketplacePluginModal.hide();
      }
    });
  }
}
