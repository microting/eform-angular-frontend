import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SiteDto, WorkerDto } from 'src/app/common/models/dto';
import { WorkersService } from 'src/app/common/services/advanced';
import { TableHeaderElementModel } from 'src/app/common/models';
import { AuthService } from 'src/app/common/services';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
})
export class WorkersComponent implements OnInit {
  @ViewChild('modalWorkerEdit', { static: true }) modalWorkerEdit;
  @ViewChild('modalWorkerCreate', { static: true }) modalWorkerCreate;
  @ViewChild('modalWorkerDelete', { static: true }) modalWorkerDelete;

  selectedWorkerDto: WorkerDto = new WorkerDto();
  workersDto: Array<WorkerDto> = [];

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'CreatedAt', sortable: false, elementId: '' },
    { name: 'Updated at', sortable: false, elementId: '' },
    { name: 'First name', sortable: false, elementId: '' },
    { name: 'Last name', sortable: false, elementId: '' },
    { name: 'Microting UID', sortable: false, elementId: '' },
    this.userClaims.workersDelete || this.userClaims.workersUpdate
      ? { name: 'Actions', sortable: false, elementId: '' }
      : null,
  ];

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  constructor(
    private workersService: WorkersService,
    private router: Router,
    private authStateService: AuthStateService
  ) {}

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
    this.workersService.getAllWorkers().subscribe((operation) => {
      if (operation && operation.success) {
        this.workersDto = operation.model;
      }
    });
  }
}
