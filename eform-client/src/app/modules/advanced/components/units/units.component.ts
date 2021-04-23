import { Component, OnInit, ViewChild } from '@angular/core';
import { UnitDto } from 'src/app/common/models/dto';
import { UnitsService } from 'src/app/common/services/advanced';
import { TableHeaderElementModel } from 'src/app/common/models';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
})
export class UnitsComponent implements OnInit {
  @ViewChild('modalUnitsOtpCode', { static: true }) modalUnitsOtpCode;
  @ViewChild('modalUnitsCreate', { static: true }) modalUnitsCreate;
  @ViewChild('modalUnitsMove', { static: true }) modalUnitsMove;
  unitModels: Array<UnitDto> = [];
  selectedUnitModel: UnitDto = new UnitDto();

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Microting UID', elementId: '', sortable: false },
    { name: 'Location', elementId: '', sortable: false },
    { name: 'OS', elementId: '', sortable: false },
    { name: 'OS Version', elementId: '', sortable: false },
    { name: 'Model', elementId: '', sortable: false },
    { name: 'InSight Version', elementId: '', sortable: false },
    { name: 'eForm Version', elementId: '', sortable: false },
    { name: 'Customer no & OTP', elementId: '', sortable: false },
    { name: 'Sync delay', elementId: '', sortable: false },
    { name: 'Sync dialog', elementId: '', sortable: false },
    { name: 'Push', elementId: '', sortable: false },
    this.userClaims.sitesDelete || this.userClaims.sitesUpdate
      ? { name: 'Actions', elementId: '', sortable: false }
      : null,
  ];

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  constructor(
    private unitsService: UnitsService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit() {
    this.loadAllUnits();
  }

  loadAllUnits() {
    this.unitsService.getAllUnits().subscribe((operation) => {
      if (operation && operation.success) {
        this.unitModels = operation.model;
      }
    });
  }

  openCreateModal() {
    this.modalUnitsCreate.show();
  }

  openMoveModal(selectedUnitDto: UnitDto) {
    this.selectedUnitModel = selectedUnitDto;
    this.modalUnitsMove.show(selectedUnitDto);
  }

  openModalUnitsOtpCode(selectedUnitDto: UnitDto) {
    this.selectedUnitModel = selectedUnitDto;
    this.modalUnitsOtpCode.show();
  }
}
