import {Component, OnInit, Inject, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeleteModalSettingModel} from 'src/app/common/models';

@Component({
    selector: 'app-delete-modal',
    templateUrl: './delete-modal.component.html',
    styleUrls: ['./delete-modal.component.scss'],
    standalone: false
})
export class DeleteModalComponent implements OnInit {
  delete: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public deleteModalSettingModel: DeleteModalSettingModel,
  ) {
  }

  ngOnInit() {
  }

  getValueModel(field: string) {
    return this.deleteModalSettingModel.model[field];
  }

  hide(result: boolean = false) {
    this.dialogRef.close(result);
  }

  onClickDelete() {
    this.delete.emit(this.deleteModalSettingModel.model);
  }
}
