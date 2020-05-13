import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {WorkerCreateModel} from 'src/app/common/models/advanced';
import {SiteDto} from 'src/app/common/models/dto';
import {WorkersService} from 'src/app/common/services/advanced';
import {DeviceUserService} from 'src/app/common/services/device-users';

@Component({
  selector: 'app-worker-create',
  templateUrl: './worker-create.component.html',
  styleUrls: ['./worker-create.component.scss']
})
export class WorkerCreateComponent implements OnInit {
  @Output() WorkerCreated: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  newWorkerModel: WorkerCreateModel = new WorkerCreateModel;
  simpleSites: Array<SiteDto> = [];

  constructor(private simpleSitesService: DeviceUserService, private workersService: WorkersService) { }

  ngOnInit() {
    this.loadAllSimpleSites();
  }

  show() {
    this.frame.show();
  }

  loadAllSimpleSites() {
    this.simpleSitesService.getAllDeviceUsers().subscribe((data => {
      this.simpleSites = data.model.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
    }));
  }

  createWorker() {
    this.newWorkerModel.customerNo =
      this.simpleSites.find(x => x.siteId === this.newWorkerModel.siteId).customerNo;
    this.workersService.createWorker(this.newWorkerModel).subscribe((data => {
      if (data && data.success) {
        this.newWorkerModel = new WorkerCreateModel;
        this.WorkerCreated.emit();
        this.frame.hide();
      }
    }));
  }
}
