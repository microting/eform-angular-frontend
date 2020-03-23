import {AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UnitModel} from '../../../../../common/models/advanced';
import {SiteDto, UnitDto} from '../../../../../common/models/dto';
import {UnitsService} from '../../../../../common/services/advanced';
import {DeviceUserService} from 'src/app/common/services/device-users';

@Component({
  selector: 'app-unit-move',
  templateUrl: './unit-move.component.html',
  styleUrls: ['./unit-move.component.scss']
})
export class UnitMoveComponent implements OnInit, AfterContentInit {
  @Output() UnitMoved: EventEmitter<void> = new EventEmitter<void>();
  @Input() selectedUnitModel: UnitDto = new UnitDto();
  @ViewChild('frame', {static: false}) frame;
  unitModel: UnitModel = new UnitModel;
  simpleSites: Array<SiteDto> = [];
  spinnerStatus = false;

  constructor(private simpleSitesService: DeviceUserService, private unitsService: UnitsService) { }

  ngOnInit() {
  }

  show(selected: UnitDto) {
    this.frame.show();
    // this.selectedUnitModel = selected;
    this.unitModel.id = selected.id;
    this.unitModel.siteId = selected.siteMicrotingUid;
    if (this.simpleSites.length === 0) {
      this.loadAllSimpleSites();
    }
  }

  ngAfterContentInit() {
  }

  loadAllSimpleSites() {
    this.spinnerStatus = true;
    this.simpleSitesService.getAllDeviceUsers().subscribe((data => {
      this.simpleSites = data.model.map((i) => { i.fullName = i.siteName; return i; });
      this.spinnerStatus = false;
    }));
  }

  moveUnit() {
    // this.newWorkerModel.customerNo =
    //   this.simpleSites.find(x => x.siteId === this.newWorkerModel.siteId).customerNo;
    this.spinnerStatus = true;
    this.unitModel.id = this.selectedUnitModel.id;
    this.unitsService.moveUnit(this.unitModel).subscribe((data => {
      if (data && data.success) {
        //     this.newWorkerModel = new WorkerCreateModel;
        this.UnitMoved.emit();
        this.frame.hide();
      }
      this.spinnerStatus = false;
    }));
  }
}
