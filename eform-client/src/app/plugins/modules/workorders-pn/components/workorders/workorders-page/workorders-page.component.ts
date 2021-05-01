import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableHeaderElementModel } from 'src/app/common/models';
import { WorkOrderModel, WorkOrdersModel } from '../../../models';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { WorkordersStateService } from 'src/app/plugins/modules/workorders-pn/components/workorders/state/workorders-state-service';

@AutoUnsubscribe()
@Component({
  selector: 'app-workorders-page',
  templateUrl: './workorders-page.component.html',
  styleUrls: ['./workorders-page.component.scss'],
})
export class WorkOrdersPageComponent implements OnInit, OnDestroy {
  @ViewChild('imagesModalComponent', { static: false }) imagesModalComponent;
  @ViewChild('deleteWorkOrderModal', { static: false }) deleteWorkOrderModal;
  workOrdersModel: WorkOrdersModel = new WorkOrdersModel();
  searchSubject = new Subject();
  getAllSub$: Subscription;

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    {
      name: 'CreatedAt',
      elementId: 'createdAtHeader',
      sortable: true,
      visibleName: 'Created at',
    },
    {
      name: 'CreatedBy',
      elementId: 'createdByHeader',
      sortable: false,
      visibleName: 'Created by',
    },
    {
      name: 'AssignedArea',
      elementId: 'assignedAreaHeader',
      sortable: true,
      visibleName: 'Area',
    },
    {
      name: 'AssignedWorker',
      elementId: 'assignedWorkerHeader',
      sortable: true,
      visibleName: 'Assigned worker',
    },
    { name: 'Description', elementId: 'descriptionHeader', sortable: true },
    {
      name: 'CorrectedAtLatest',
      elementId: 'correctedAtTheLatestHeader',
      sortable: true,
      visibleName: 'Corrected at the latest',
    },
    {
      name: 'DoneAt',
      elementId: 'doneAtHeader',
      sortable: true,
      visibleName: 'Done at',
    },
    {
      name: 'DoneAt',
      elementId: 'status',
      sortable: false,
      visibleName: 'Status',
    },
    {
      name: 'Done by',
      elementId: 'doneByHeader',
      sortable: false,
    },
    {
      name: 'DescriptionOfTaskDone',
      elementId: 'descriptionOfTaskDoneHeader',
      sortable: true,
      visibleName: 'Description of the task done',
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(public workordersStateService: WorkordersStateService) {
    this.searchSubject.pipe(debounceTime(500)).subscribe((val) => {
      this.workordersStateService.updateNameFilter(val.toString());
      this.getWorkOrders();
    });
  }

  ngOnInit() {
    this.getWorkOrders();
  }

  showDeleteWorkOrderModal(workOrderModel: WorkOrderModel) {
    this.deleteWorkOrderModal.show(workOrderModel);
  }

  getWorkOrders() {
    this.getAllSub$ = this.workordersStateService
      .getAllWorkOrders()
      .subscribe((data) => {
        if (data && data.success) {
          this.workOrdersModel = data.model;
        }
      });
  }

  sortTable(sort: string) {
    this.workordersStateService.onSortTable(sort);
    this.getWorkOrders();
  }

  changePage(e: any) {
    this.workordersStateService.changePage(e);
    this.getWorkOrders();
  }

  onSearchInputChanged(e: string) {
    this.searchSubject.next(e);
  }

  openPicturesModal(images: string[]) {
    this.imagesModalComponent.show(images);
  }

  ngOnDestroy(): void {}

  onPageSizeChanged(newPageSize: number) {
    this.workordersStateService.updatePageSize(newPageSize);
    this.getWorkOrders();
  }

  workOrderDeleted() {
    this.workordersStateService.onDelete();
    this.getWorkOrders();
  }
}
