import {Component, Inject, OnInit} from '@angular/core';
import {WorkerDto} from 'src/app/common/models';
import {WorkersService} from 'src/app/common/services';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-worker-delete',
  templateUrl: './worker-delete.component.html',
  styleUrls: ['./worker-delete.component.scss']
})
export class WorkerDeleteComponent implements OnInit {

  constructor(
    private workersService: WorkersService,
    public dialogRef: MatDialogRef<WorkerDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedWorkerDto: WorkerDto = new WorkerDto()
  ) {
  }

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
