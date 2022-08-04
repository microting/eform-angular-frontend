import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {WorkerDto} from 'src/app/common/models';
import {WorkersService} from 'src/app/common/services';
import {AuthStateService} from 'src/app/common/store';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {WorkerDeleteComponent, WorkerEditCreateComponent} from '../';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
})
export class WorkersComponent implements OnInit {
  @ViewChild('modalWorkerDelete', {static: true}) modalWorkerDelete;

  selectedWorkerDto: WorkerDto = new WorkerDto();
  workersDto: Array<WorkerDto> = [];

  tableHeaders: MtxGridColumn[] = [
    {header: 'CreatedAt', field: 'createdAt', type: 'date', typeParameter: {format: 'dd.MM.y HH:mm:ss'}},
    {header: 'Updated at', field: 'updatedAt', type: 'date', typeParameter: {format: 'dd.MM.y HH:mm:ss'}},
    {header: 'First name', field: 'firstName',},
    {header: 'Last name', field: 'lastName',},
    {header: 'Microting UID', field: 'workerUId'},
    this.userClaims.workersDelete || this.userClaims.workersUpdate
      ? {header: 'Actions', field: 'actions'}
      : undefined,
  ];
  editWorkerComponentAfterClosedSub$: Subscription;
  createWorkerComponentAfterClosedSub$: Subscription;

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  constructor(
    private workersService: WorkersService,
    private router: Router,
    private authStateService: AuthStateService,
    public dialog: MatDialog,
    private overlay: Overlay
  ) {
  }

  ngOnInit() {
    this.loadAllWorkers();
  }

  openEditModal(selectedWorker: WorkerDto) {
    this.editWorkerComponentAfterClosedSub$ = this.dialog.open(WorkerEditCreateComponent,
      {...dialogConfigHelper(this.overlay, selectedWorker), minWidth: 500})
      .afterClosed().subscribe(data => data ? this.loadAllWorkers() : undefined);
  }

  openDeleteModal(selectedWorker: WorkerDto) {
    this.editWorkerComponentAfterClosedSub$ = this.dialog.open(WorkerDeleteComponent,
      dialogConfigHelper(this.overlay, selectedWorker))
      .afterClosed().subscribe(data => data ? this.loadAllWorkers() : undefined);
  }

  openCreateModal() {
    this.createWorkerComponentAfterClosedSub$ = this.dialog.open(WorkerEditCreateComponent,
      {...dialogConfigHelper(this.overlay, new WorkerDto()), minWidth: 500})
      .afterClosed().subscribe(data => data ? this.loadAllWorkers() : undefined);
  }

  loadAllWorkers() {
    this.workersService.getAllWorkers().subscribe((operation) => {
      if (operation && operation.success) {
        this.workersDto = operation.model;
      }
    });
  }
}
