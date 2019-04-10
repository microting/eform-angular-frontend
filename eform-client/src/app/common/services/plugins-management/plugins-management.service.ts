import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from 'src/app/common/models';
import {
  InstalledPluginsModel,
  InstalledPluginsRequestModel,
  InstalledPluginUpdateModel,
  MarketplacePluginsModel,
  MarketplacePluginsRequestModel
} from 'src/app/common/models/plugins-management';
import {BaseService} from 'src/app/common/services/base.service';

const PluginsManagementMethods = {
  InstalledPlugins: '/api/plugins-management/installed',
  MarketplacePlugins: '/api/plugins-management/marketplace',
};

@Injectable()
export class PluginsManagementService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getInstalledPlugins(model: InstalledPluginsRequestModel): Observable<OperationDataResult<InstalledPluginsModel>> {
    return this.get(PluginsManagementMethods.InstalledPlugins, model);
  }

  updateInstalledPlugin(model: InstalledPluginUpdateModel): Observable<OperationResult> {
    return this.put(PluginsManagementMethods.InstalledPlugins, model);
  }

  getMarketplacePlugins(model: MarketplacePluginsRequestModel): Observable<OperationDataResult<MarketplacePluginsModel>> {
    return this.get(PluginsManagementMethods.MarketplacePlugins, model);
  }

  installMarketplacePlugin(pluginId: string): Observable<OperationResult> {
    return this.put(PluginsManagementMethods.MarketplacePlugins, pluginId);
  }
}
