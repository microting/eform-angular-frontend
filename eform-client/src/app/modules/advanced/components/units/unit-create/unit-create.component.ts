import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UnitModel} from '../../../../../common/models/advanced';
import {SiteDto} from '../../../../../common/models/dto';
import {UnitsService} from '../../../../../common/services/advanced';
import {DeviceUserService} from 'src/app/common/services/device-users';
import {DeviceUserRequestModel} from 'src/app/common/models';

@Component({
  selector: 'app-unit-create',
  templateUrl: './unit-create.component.html',
  styleUrls: ['./unit-create.component.scss']
})
export class UnitCreateComponent implements OnInit {
  @Output() UnitCreated: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame') frame;
  unitModel: UnitModel = new UnitModel;
  simpleSites: Array<SiteDto> = [];

  constructor(private simpleSitesService: DeviceUserService, private unitsService: UnitsService) { }

  ngOnInit() {
    this.loadAllSimpleSites();
  }

  show() {
    this.frame.show();
  }

  loadAllSimpleSites() {
    this.simpleSitesService.getDeviceUsersFiltered( new DeviceUserRequestModel).subscribe((data => {
      this.simpleSites = data.model.map((i) => { i.fullName = i.siteName; return i; });

      // this.simpleSites = data.model.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
    }));
  }

  createUnit() {
    // this.newWorkerModel.customerNo =
    //   this.simpleSites.find(x => x.siteId === this.newWorkerModel.siteId).customerNo;
    this.unitsService.createUnit(this.unitModel).subscribe((data => {
      if (data && data.success) {
    //     this.newWorkerModel = new WorkerCreateModel;
        this.UnitCreated.emit();
        this.frame.hide();
      }
    }));
  }
}
