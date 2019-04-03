import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MarketplacePluginModel} from '../../../../../common/models/plugins-management';

@Component({
  selector: 'app-plugins-marketplace-install',
  templateUrl: './marketplace-plugin-install.component.html',
  styleUrls: ['./marketplace-plugin-install.component.scss']
})
export class MarketplacePluginInstallComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onMarketplacePluginInstall: EventEmitter<MarketplacePluginModel> = new EventEmitter();
  selectedPluginModel: MarketplacePluginModel = new MarketplacePluginModel();

  constructor() { }

  ngOnInit() {
  }

  show(model: MarketplacePluginModel) {
    this.selectedPluginModel = model;
    this.frame.show();
  }

  hide() { this.frame.hide(); }

  installPlugin() {
    this.onMarketplacePluginInstall.emit(this.selectedPluginModel);
  }

}
