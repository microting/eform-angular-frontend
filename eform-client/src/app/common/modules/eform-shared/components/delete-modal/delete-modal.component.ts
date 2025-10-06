import { Component, OnInit, EventEmitter, inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeleteModalSettingModel} from 'src/app/common/models';

@Component({
    selector: 'app-delete-modal',
    templateUrl: './delete-modal.component.html',
    styleUrls: ['./delete-modal.component.scss'],
    standalone: false
})
export class DeleteModalComponent implements OnInit {
  dialogRef = inject<MatDialogRef<DeleteModalComponent>>(MatDialogRef);
  deleteModalSettingModel = inject<DeleteModalSettingModel>(MAT_DIALOG_DATA);

  delete: EventEmitter<any> = new EventEmitter<any>();

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
