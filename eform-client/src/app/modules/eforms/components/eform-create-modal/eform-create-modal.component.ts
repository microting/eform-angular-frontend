import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import {CommonDictionaryModel} from 'src/app/common/models/common';
import {EFormCreateModel} from 'src/app/common/models/eforms';
import {EFormService} from 'src/app/common/services/eform';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MtxSelect } from '@ng-matero/extensions/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-eform-create-modal',
    templateUrl: './eform-create-modal.component.html',
    styleUrls: ['./eform-create-modal.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MtxSelect, ReactiveFormsModule, FormsModule, MatInput, MatDialogActions, MatIcon, TranslatePipe]
})
export class EformCreateModalComponent implements OnInit {
  private eFormService = inject(EFormService);
  dialogRef = inject<MatDialogRef<EformCreateModalComponent>>(MatDialogRef);
  availableTags = inject<Array<CommonDictionaryModel>>(MAT_DIALOG_DATA) ?? [];

  eFormCreateModel: EFormCreateModel = new EFormCreateModel();

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
