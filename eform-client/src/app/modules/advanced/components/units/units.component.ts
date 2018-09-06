import {Component, OnInit, ViewChild} from '@angular/core';
import {UnitDto} from 'src/app/common/models/dto';
import {UnitsService} from 'src/app/common/services/advanced';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html'
})
export class UnitsComponent implements OnInit {

  @ViewChild('modalUnitsOtpCode') modalUnitsOtpCode;
  spinnerStatus = false;
  unitModels: Array<UnitDto> = [];
  selectedUnitModel: UnitDto = new UnitDto();

  constructor(private unitsService: UnitsService) {
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

  openModalUnitsOtpCode(selectedUnitDto: UnitDto) {
    this.selectedUnitModel = selectedUnitDto;
    this.modalUnitsOtpCode.show();
  }
}
