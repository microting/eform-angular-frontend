import {Component, OnInit,} from '@angular/core';
import {SiteDto, UnitModel} from 'src/app/common/models';
import {UnitsService} from 'src/app/common/services';
import {DeviceUserService} from 'src/app/common/services/device-users';
import {DeviceUserRequestModel} from 'src/app/common/models';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-unit-create',
  templateUrl: './unit-create.component.html',
  styleUrls: ['./unit-create.component.scss']
})
export class UnitCreateComponent implements OnInit {
  unitModel: UnitModel = new UnitModel;
  simpleSites: Array<SiteDto> = [];

  constructor(
    private simpleSitesService: DeviceUserService,
    private unitsService: UnitsService,
    public dialogRef: MatDialogRef<UnitCreateComponent>,
    ) {
  }

  ngOnInit() {
    this.loadAllSimpleSites();
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  loadAllSimpleSites() {
    this.simpleSitesService.getDeviceUsersFiltered( new DeviceUserRequestModel).subscribe((data => {
      this.simpleSites = data.model.map((i) => { i.fullName = i.siteName; return i; });
      // this.simpleSites = data.model.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
    }));
  }

  createUnit() {
    // this.newWorkerModel.customerNo =
    // this.simpleSites.find(x => x.siteId === this.newWorkerModel.siteId).customerNo;
    this.unitsService.createUnit(this.unitModel).subscribe((data => {
      if (data && data.success) {
        //this.newWorkerModel = new WorkerCreateModel;
        this.hide(true);
      }
    }));
  }
}
