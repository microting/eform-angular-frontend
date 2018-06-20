import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import {VehiclePnModel} from '../../models';
import {VehiclesPnService} from '../../services';

@Component({
  selector: 'vehicles-pn-add-update-pn-page',
  templateUrl: './vehicles-pn-add-update.component.html'
})
export class VehiclesPnAddUpdateComponent implements OnInit {
  @Input() selectedVehicleModel: VehiclePnModel = new VehiclePnModel();
  @ViewChild('createVehicleModal') createVehicleModal: ModalComponent;
  @ViewChild('editVehicleModal') editVehicleModal: ModalComponent;

  newVehicleModel: VehiclePnModel = new VehiclePnModel();

  constructor(private vehiclesService: VehiclesPnService) {

  }

  ngOnInit() {

  }

  showCreateVehicleModal() {
    this.createVehicleModal.open();
  }

  showEditVehicleModal() {
    this.editVehicleModal.open();
  }

  updateVehicle() {
    this.vehiclesService.updateVehicle(this.selectedVehicleModel).subscribe(((data) => {
      this.editVehicleModal.dismiss();
    }));
  }

  createVehicle() {
    this.vehiclesService.createVehicle(this.newVehicleModel).subscribe(((data) => {
      this.newVehicleModel = new VehiclePnModel();
      this.createVehicleModal.dismiss();
    }));
  }

}
