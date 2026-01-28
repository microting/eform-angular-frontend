import { Component, OnInit, EventEmitter, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import {DeleteModalSettingModel} from 'src/app/common/models';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, DatePipe } from '@angular/common';
import { DateFormatterComponent } from '../date-formatter/date-formatter.component';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-delete-modal',
    templateUrl: './delete-modal.component.html',
    styleUrls: ['./delete-modal.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, NgFor, NgSwitch, NgSwitchCase, DateFormatterComponent, NgSwitchDefault, MatDialogActions, MatButton, DatePipe, TranslatePipe]
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
