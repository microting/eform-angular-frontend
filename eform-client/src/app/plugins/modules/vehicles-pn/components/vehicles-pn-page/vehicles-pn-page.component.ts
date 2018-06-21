import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LocaleService} from 'app/services';

import {VehiclePnModel, VehiclesPnModel, VehiclesPnRequestModel} from '../../models';
import {VehiclesPnService} from '../../services';
import {VehiclesPnAddUpdateComponent} from '../vehicle-pn-add-update/vehicles-pn-add-update.component';

@Component({
  selector: 'app-vehicles-pn-page',
  templateUrl: './vehicles-pn-page.component.html'
})
export class VehiclesPnPageComponent implements OnInit {
  @ViewChild('vehiclePnAddUpdateComponent') vehiclePnAddUpdateComponent: VehiclesPnAddUpdateComponent;

  vehiclesRequestModel: VehiclesPnRequestModel = new VehiclesPnRequestModel();
  vehiclesModel: VehiclesPnModel = new VehiclesPnModel();
  selectedVehicleModel: VehiclePnModel = new VehiclePnModel();
  spinnerStatus = false;

  constructor(private vehiclesService: VehiclesPnService,
              private translateService: TranslateService,
              private localeService: LocaleService) {

  }

  ngOnInit() {
    this.setTranslation();
    this.getAllVehicles();
  }

  setTranslation() {
    const lang = this.localeService.getCurrentUserLocale();
    const i18n = require(`../../i18n/${lang}.json`);
    this.translateService.setTranslation(lang, i18n, true);
  }

  showCreateVehicleModal() {
    this.vehiclePnAddUpdateComponent.showCreateVehicleModal();
  }

  showEditVehicleModal(model: VehiclePnModel) {
    this.selectedVehicleModel = model;
    this.vehiclePnAddUpdateComponent.showEditVehicleModal();
  }

  getAllVehicles() {
    this.vehiclesService.getAllVehicles(this.vehiclesRequestModel).subscribe((data => {
      this.vehiclesModel = data.model;
    }));
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.vehiclesRequestModel.offset = e;
      if (e === 0) {
        this.vehiclesRequestModel.pageIndex = 0;
      } else {
        this.vehiclesRequestModel.pageIndex = Math.floor(e / this.vehiclesRequestModel.pageSize);
      }
      this.getAllVehicles();
    }
  }

}
