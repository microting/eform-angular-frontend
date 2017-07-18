import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {UnitDto} from 'app/models/dto';
import {NotifyService, UnitsService} from 'app/services';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  @ViewChild('unitOtpRequestModal')
  unitOtpRequestModal: ModalComponent;
  spinnerStatus = true;

  unitModels: Array<UnitDto> = [];
  selectedUnitModel: UnitDto = new UnitDto();

  constructor(private unitsService: UnitsService, private notifyService: NotifyService) {
  }

  ngOnInit() {
    this.loadAllUnits();
  }

  loadAllUnits() {
    this.spinnerStatus = true;
    this.unitsService.getAllUnits().subscribe(operation => {
      if (operation && operation.success) {
        this.unitModels = operation.model;
      }
      this.spinnerStatus = false;
    });
  }

  requestOtp(id: number) {
    this.spinnerStatus = true;
    this.unitsService.requestOtp(id).subscribe(operation => {
      this.spinnerStatus = false;
      if (operation && operation.success) {
        this.loadAllUnits();
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
    });
  }

  showRequestOtpModal(unitModel: UnitDto) {
    if (!unitModel.unitUId) {
      return;
    }
    this.selectedUnitModel = unitModel;
    this.unitOtpRequestModal.open();
  }

  saveRequestOtpModal() {
    this.requestOtp(this.selectedUnitModel.unitUId);
    this.unitOtpRequestModal.close();
  }
}
