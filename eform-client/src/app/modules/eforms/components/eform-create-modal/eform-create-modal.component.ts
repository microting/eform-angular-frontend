import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import {CommonDictionaryModel} from 'src/app/common/models/common';
import {EFormCreateModel} from 'src/app/common/models/eforms';
import {EFormService} from 'src/app/common/services/eform';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'app-eform-create-modal',
    templateUrl: './eform-create-modal.component.html',
    styleUrls: ['./eform-create-modal.component.scss'],
    standalone: false
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
    // Close the dialog regardless of outcome — `finalize` covers all paths
    // including the global HttpErrorInterceptor's EMPTY return for 401/403/5xx
    // (where neither `next` nor `error` would fire and the modal would hang).
    // Errors are surfaced by the interceptor's toast; the caller distinguishes
    // success/failure via the dialogRef result.
    let success = false;
    this.eFormService
      .createSingle(this.eFormCreateModel)
      .pipe(finalize(() => this.hide(success)))
      .subscribe({
        next: (operation) => {
          success = !!(operation && operation.success);
        },
        error: () => {
          /* toast surfaced by interceptor; finalize closes the dialog */
        },
      });
  }

  hide(result = false) {
    this.dialogRef.close(result);
    this.eFormCreateModel = new EFormCreateModel;
  }
}
