import {Component, OnInit, ViewChild} from '@angular/core';
import {UserRegisterModel} from 'app/models';
import {VehiclesPnAddUpdateComponent} from '../vehicle-pn-add-update/vehicles-pn-add-update.component';

@Component({
  selector: 'app-vehicles-pn-page',
  templateUrl: './vehicles-pn-page.component.html'
})
export class VehiclesPnPageComponent implements OnInit {
  @ViewChild('vehiclePnAddUpdateComponent') vehiclePnAddUpdateComponent: VehiclesPnAddUpdateComponent;

  spinnerStatus = false;
  constructor() {

  }

  ngOnInit() {

  }

  showCreateVehicleModal() {
    this.vehiclePnAddUpdateComponent.showCreateVehicleModal();
  }

  showEditVehicleModal() {
    this.vehiclePnAddUpdateComponent.showEditVehicleModal();
  }

}
