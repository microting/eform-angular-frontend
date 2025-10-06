import { Component, OnInit, inject } from '@angular/core';
import {WorkerDto, WorkerCreateModel, WorkerModel, CommonDictionaryModel} from 'src/app/common/models';
import {WorkersService, DeviceUserService} from 'src/app/common/services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-worker-edit-create',
    templateUrl: './worker-edit-create.component.html',
    styleUrls: ['./worker-edit-create.component.scss'],
    standalone: false
})
export class WorkerEditCreateComponent implements OnInit {
  private simpleSitesService = inject(DeviceUserService);
  private workersService = inject(WorkersService);
  dialogRef = inject<MatDialogRef<WorkerEditCreateComponent>>(MatDialogRef);
  workerModel = inject<WorkerDto>(MAT_DIALOG_DATA) ?? new WorkerDto();

  simpleSites: Array<CommonDictionaryModel> = [];
  edit: boolean;

  constructor() {
    const workerModel = this.workerModel;

    this.edit = !!workerModel.workerUId;
  }

  ngOnInit() {
    this.loadAllSimpleSites();
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  loadAllSimpleSites() {
    this.simpleSitesService.getCommonDictionarySites().subscribe(data => {
      if (data && data.success && data.model) {
        this.simpleSites = data.model;
      }
    });
  }

  createWorker() {
    this.simpleSitesService.getSingleSimpleSite(this.workerModel.workerUId)
      .subscribe(data => {
        if (data && data.success && data.model) {
          const newWorkerModel: WorkerCreateModel = {
            firstName: this.workerModel.firstName,
            lastName: this.workerModel.lastName,
            siteId: this.workerModel.workerUId,
            customerNo: data.model.customerNo,
          };
          this.workersService.createWorker(newWorkerModel).subscribe((data => {
            if (data && data.success) {
              this.hide(true);
            }
          }));
        }
      });
  }

  updateSingle() {
    const workerModel: WorkerModel = {
      userFirstName: this.workerModel.firstName,
      userLastName: this.workerModel.lastName,
      id: this.workerModel.workerUId,
    };
    this.workersService.updateSingleWorker(workerModel).subscribe(operation => {
      if (operation && operation.success) {
        this.hide(true);
      }
    });
  }
}
