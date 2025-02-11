import {
  Component,
  EventEmitter, Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
  constructor(private eFormService: EFormService,
  public dialogRef: MatDialogRef<EformDuplicateConfirmModalComponent>,
  @Inject(MAT_DIALOG_DATA) public selectedTemplateDto: TemplateDto = new TemplateDto(),) {}

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
