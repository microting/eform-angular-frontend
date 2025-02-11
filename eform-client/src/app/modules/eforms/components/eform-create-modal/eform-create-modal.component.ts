import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from 'src/app/common/models/common';
import {EFormCreateModel} from 'src/app/common/models/eforms';
import {EFormService} from 'src/app/common/services/eform';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-eform-create-modal',
    templateUrl: './eform-create-modal.component.html',
    styleUrls: ['./eform-create-modal.component.scss'],
    standalone: false
})
export class EformCreateModalComponent implements OnInit {
  eFormCreateModel: EFormCreateModel = new EFormCreateModel();

  constructor(private eFormService: EFormService,
  public dialogRef: MatDialogRef<EformCreateModalComponent>,
  @Inject(MAT_DIALOG_DATA) public availableTags: Array<CommonDictionaryModel> = []) {
  }

  ngOnInit() {
  }

  createTemplate() {
    if (!this.eFormCreateModel.newTag) {
      delete this.eFormCreateModel.newTag;
    }
    this.eFormService.createSingle(this.eFormCreateModel).subscribe((operation => {
      if (operation && operation.success) {
        this.hide(true);
      }
    }));
  }

  hide(result = false) {
    this.dialogRef.close(result);
    this.eFormCreateModel = new EFormCreateModel;
  }
}
