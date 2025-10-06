import { Component, OnInit, inject } from '@angular/core';
import {WorkerDto} from 'src/app/common/models';
import {WorkersService} from 'src/app/common/services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-worker-delete',
    templateUrl: './worker-delete.component.html',
    styleUrls: ['./worker-delete.component.scss'],
    standalone: false
})
export class WorkerDeleteComponent implements OnInit {
  private workersService = inject(WorkersService);
  dialogRef = inject<MatDialogRef<WorkerDeleteComponent>>(MatDialogRef);
  selectedWorkerDto = inject<WorkerDto>(MAT_DIALOG_DATA) ?? new WorkerDto();


  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  deleteWorker() {
    this.workersService.deleteSingleWorker(this.selectedWorkerDto.workerUId)
      .subscribe(operation => {
        if (operation && operation.success) {
          this.hide(true);
        }
      });
  }

}
