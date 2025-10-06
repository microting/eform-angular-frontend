import { Component, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { TemplateDto } from 'src/app/common/models/dto';
import { EFormService } from 'src/app/common/services/eform';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-eform-duplicate-confirm-modal',
    templateUrl: './eform-duplicate-confirm-modal.component.html',
    styleUrls: ['./eform-duplicate-confirm-modal.component.scss'],
    standalone: false
})
export class EformDuplicateConfirmModalComponent implements OnInit {
  private eFormService = inject(EFormService);
  dialogRef = inject<MatDialogRef<EformDuplicateConfirmModalComponent>>(MatDialogRef);
  selectedTemplateDto = inject<TemplateDto>(MAT_DIALOG_DATA) ?? new TemplateDto();


  ngOnInit() {}

  duplicateEfrom() {
    this.eFormService
      .duplicateEForms(this.selectedTemplateDto.id)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.hide(true);
        }
      });
  }

  hide(duplicate = false) {
    this.dialogRef.close(duplicate);
  }

}
