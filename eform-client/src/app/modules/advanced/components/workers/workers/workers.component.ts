import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {WorkerCreateModel} from 'src/app/common/models/advanced';
import {SiteDto, WorkerDto} from 'src/app/common/models/dto';
import {WorkersService} from 'src/app/common/services/advanced';
import {AuthService} from 'src/app/common/services/auth';
import {DeviceUserService} from 'src/app/common/services/device-users';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html'
})
export class WorkersComponent implements OnInit {

  @ViewChild('modalWorkerEdit') modalWorkerEdit;
  @ViewChild('modalWorkerCreate') modalWorkerCreate;
  @ViewChild('modalWorkerDelete') modalWorkerDelete;

  spinnerStatus = true;
  selectedWorkerDto: WorkerDto = new WorkerDto();
  workersDto: Array<WorkerDto> = [];

  get userClaims() { return this.authService.userClaims; }

  constructor(private workersService: WorkersService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loadAllWorkers();
  }

  openEditModal(selectedWorker: WorkerDto) {
    this.selectedWorkerDto = selectedWorker;
    this.modalWorkerEdit.show();
  }

  openDeleteModal(selectedWorker: WorkerDto) {
    this.selectedWorkerDto = selectedWorker;
    this.modalWorkerDelete.show();
  }

  openCreateModal() {
    this.modalWorkerCreate.show();
  }

  loadAllWorkers() {
    this.spinnerStatus = true;
    this.workersService.getAllWorkers().subscribe((operation) => {
      if (operation && operation.success) {
        this.workersDto = operation.model;
      }
      this.spinnerStatus = false;
    });
  }
}
