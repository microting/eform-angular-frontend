import { Component, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { TemplateDto } from 'src/app/common/models/dto';
import { EFormService } from 'src/app/common/services/eform';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DateFormatterComponent } from '../../../../common/modules/eform-shared/components/date-formatter/date-formatter.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-eform-duplicate-confirm-modal',
    templateUrl: './eform-duplicate-confirm-modal.component.html',
    styleUrls: ['./eform-duplicate-confirm-modal.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, DateFormatterComponent, MatDialogActions, TranslatePipe]
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
