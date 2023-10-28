import {Component, OnInit,} from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {selectCurrentUserClaimsWorkersCreate} from 'src/app/state/auth/auth.selector';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
})
export class WorkersComponent implements OnInit {
  workersDto: Array<WorkerDto> = [];

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('CreatedAt'), field: 'createdAt', type: 'date', typeParameter: {format: 'dd.MM.y HH:mm:ss'}},
    {header: this.translateService.stream('Updated at'), field: 'updatedAt', type: 'date', typeParameter: {format: 'dd.MM.y HH:mm:ss'}},
    {header: this.translateService.stream('First name'), field: 'firstName',},
    {header: this.translateService.stream('Last name'), field: 'lastName',},
    {header: this.translateService.stream('Microting UID'), field: 'workerUId'},
  ];
  editWorkerComponentAfterClosedSub$: Subscription;
  createWorkerComponentAfterClosedSub$: Subscription;
  public selectCurrentUserClaimsWorkersCreate$ = this.authStore.select(selectCurrentUserClaimsWorkersCreate);
  public selectCurrentUserClaimsWorkersUpdate$ = this.authStore.select(selectCurrentUserClaimsWorkersCreate);
  public selectCurrentUserClaimsWorkersDelete$ = this.authStore.select(selectCurrentUserClaimsWorkersCreate);

  constructor(
    private authStore: Store,
    private workersService: WorkersService,
    public dialog: MatDialog,
    private overlay: Overlay,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.loadAllWorkers();
    let actionsEnabled = false;
    this.selectCurrentUserClaimsWorkersDelete$.subscribe(x => {
      if(x) {
        actionsEnabled = true;
        this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
          {
            header: this.translateService.stream('Actions'),
            field: 'actions',
          },
        ];
      }
    });
    this.selectCurrentUserClaimsWorkersUpdate$.subscribe(x => {
      if(x && !actionsEnabled) {
        this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
          {
            header: this.translateService.stream('Actions'),
            field: 'actions',
          },
        ];
      }
    });
    // this.getCurrentUserClaimsAsyncSub$ = this.authStateService.currentUserClaimsAsync.subscribe(x => {
    //   if(x.workersDelete || x.workersUpdate) {
    //     this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
    //       {
    //         header: this.translateService.stream('Actions'),
    //         field: 'actions',
    //       },
    //     ];
    //   }
    // })
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
