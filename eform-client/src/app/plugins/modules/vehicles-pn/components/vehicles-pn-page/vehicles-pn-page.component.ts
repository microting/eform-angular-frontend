import {Component, OnInit, ViewChild} from '@angular/core';

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

  constructor(private vehiclesService: VehiclesPnService) {

  }

  ngOnInit() {
    this.getAllVehicles();
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

}
