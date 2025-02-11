import {Component, Inject, OnInit} from '@angular/core';
import {UnitModel, SiteDto, UnitDto, DeviceUserRequestModel } from 'src/app/common/models';
import {UnitsService, DeviceUserService} from 'src/app/common/services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-unit-move',
    templateUrl: './unit-move.component.html',
    styleUrls: ['./unit-move.component.scss'],
    standalone: false
})
export class UnitMoveComponent implements OnInit {
  unitModel: UnitModel = new UnitModel;
  simpleSites: Array<SiteDto> = [];

  constructor(
    private simpleSitesService: DeviceUserService,
    private unitsService: UnitsService,
    public dialogRef: MatDialogRef<UnitMoveComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedUnitModel: UnitDto = new UnitDto()
  ) {
    this.unitModel.id = selectedUnitModel.id;
    this.unitModel.siteId = selectedUnitModel.siteMicrotingUid;
    if (this.simpleSites.length === 0) {
      this.loadAllSimpleSites();
    }
  }

  ngOnInit() {
  }

  loadAllSimpleSites() {
    this.simpleSitesService.getDeviceUsersFiltered(new DeviceUserRequestModel).subscribe((data => {
      this.simpleSites = data.model.map((i) => { i.fullName = i.siteName; return i; });
    }));
  }

  moveUnit() {
    // this.newWorkerModel.customerNo =
    //   this.simpleSites.find(x => x.siteId === this.newWorkerModel.siteId).customerNo;
    this.unitModel.id = this.selectedUnitModel.id;
    this.unitsService.moveUnit(this.unitModel).subscribe((data => {
      if (data && data.success) {
        this.hide(true);
      }
    }));
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }
}
