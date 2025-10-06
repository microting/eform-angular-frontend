import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult, OperationResult } from 'src/app/common/models';
import {
  InstalledPluginsModel,
  InstalledPluginsRequestModel,
  InstalledPluginUpdateModel,
  MarketplacePluginsModel,
  MarketplacePluginsRequestModel,
} from 'src/app/common/models/plugins-management';
import { ApiBaseService } from 'src/app/common/services';

const PluginsManagementMethods = {
  InstalledPlugins: '/api/plugins-management/installed',
  MarketplacePlugins: '/api/plugins-management/marketplace',
};

@Injectable()
export class PluginsManagementService {
  private apiBaseService = inject(ApiBaseService);


  getInstalledPlugins(
    model: InstalledPluginsRequestModel
  ): Observable<OperationDataResult<InstalledPluginsModel>> {
    return this.apiBaseService.get(
      PluginsManagementMethods.InstalledPlugins,
      model
    );
  }

  updateInstalledPlugin(
    model: InstalledPluginUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put(
      PluginsManagementMethods.InstalledPlugins,
      model
    );
  }

  getMarketplacePlugins(
    model: MarketplacePluginsRequestModel
  ): Observable<OperationDataResult<MarketplacePluginsModel>> {
    return this.apiBaseService.get(
      PluginsManagementMethods.MarketplacePlugins,
      model
    );
  }

  installMarketplacePlugin(pluginId: string): Observable<OperationResult> {
    return this.apiBaseService.put(
      PluginsManagementMethods.MarketplacePlugins,
      pluginId
    );
  }
}
