import {Component, Inject, OnInit,} from '@angular/core';
import {TemplateDto} from 'src/app/common/models/dto';
import {EFormService} from 'src/app/common/services/eform';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-eform-remove-eform-modal',
    templateUrl: './eform-remove-eform-modal.component.html',
    styleUrls: ['./eform-remove-eform-modal.component.scss'],
    standalone: false
})
export class EformRemoveEformModalComponent implements OnInit {
  constructor(
    private eFormService: EFormService,
    public dialogRef: MatDialogRef<EformRemoveEformModalComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedTemplateDto: TemplateDto = new TemplateDto(),) {
  }

  ngOnInit() {
  }

  deleteEfrom() {
    this.eFormService.deleteSingle(this.selectedTemplateDto.id).subscribe(operation => {
      if (operation && operation.success) {
        this.hide(true);
      }
    });
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }
}
