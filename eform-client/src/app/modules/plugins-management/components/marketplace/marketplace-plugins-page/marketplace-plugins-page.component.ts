import {Component, OnDestroy, OnInit} from '@angular/core';
import {PluginsManagementService} from 'src/app/common/services';
import {
  MarketplacePluginModel, MarketplacePluginsModel,
  MarketplacePluginsRequestModel
} from 'src/app/common/models/plugins-management';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {MarketplacePluginInstallComponent} from 'src/app/modules/plugins-management/components';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import { TranslateService } from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
    selector: 'app-plugins-marketplace-page',
    templateUrl: './marketplace-plugins-page.component.html',
    styleUrls: ['./marketplace-plugins-page.component.scss'],
    standalone: false
})
export class MarketplacePluginsPageComponent implements OnInit, OnDestroy{
  marketplacePluginsRequestModel: MarketplacePluginsRequestModel = new MarketplacePluginsRequestModel();
  marketplacePluginsList: MarketplacePluginsModel = new MarketplacePluginsModel();
  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'pluginId'},
    {header: this.translateService.stream('Name'), field: 'name',},
    {header: this.translateService.stream('Actions'), field: 'actions'},
  ];
  marketplacePluginInstallComponentAfterClosedSub$: Subscription;
  getMarketplacePluginsSub$: Subscription;

  constructor(
    private pluginManagementService: PluginsManagementService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private translateService: TranslateService,) {
  }

  ngOnInit() {
    this.getMarketplacePlugins();
  }

  getMarketplacePlugins() {
    this.getMarketplacePluginsSub$ = this.pluginManagementService.getMarketplacePlugins(this.marketplacePluginsRequestModel)
      .subscribe((data) => {
      if (data && data.success) {
        this.marketplacePluginsList = data.model;
      }
    });
  }

  showEditModal(marketplacePlugin: MarketplacePluginModel) {
    this.marketplacePluginInstallComponentAfterClosedSub$ = this.dialog.open(MarketplacePluginInstallComponent,
      dialogConfigHelper(this.overlay, marketplacePlugin))
      .afterClosed().subscribe(data => data ? undefined : undefined);
  }

  ngOnDestroy(): void {
  }

}
