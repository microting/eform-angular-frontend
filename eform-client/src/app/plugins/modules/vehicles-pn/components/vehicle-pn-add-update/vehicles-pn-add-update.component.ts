import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  selector: 'vehicles-pn-add-update-pn-page',
  templateUrl: './vehicles-pn-add-update.component.html'
})
export class VehiclesPnAddUpdateComponent implements OnInit {
  @ViewChild('createVehicle') createVehicleModal: ModalComponent;
  @ViewChild('editVehicle') editVehicleModal: ModalComponent;

  testModel: any;
  constructor() {

  }

  ngOnInit() {

  }

  showCreateVehicleModal() {
    this.createVehicleModal.open();
  }

  showEditVehicleModal() {
    this.editVehicleModal.open();
  }

}
