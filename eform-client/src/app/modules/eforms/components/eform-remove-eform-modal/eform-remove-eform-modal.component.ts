import { Component, OnInit, inject } from '@angular/core';
import {TemplateDto} from 'src/app/common/models/dto';
import {EFormService} from 'src/app/common/services/eform';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DateFormatterComponent } from '../../../../common/modules/eform-shared/components/date-formatter/date-formatter.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-eform-remove-eform-modal',
    templateUrl: './eform-remove-eform-modal.component.html',
    styleUrls: ['./eform-remove-eform-modal.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, DateFormatterComponent, MatDialogActions, TranslatePipe]
})
export class EformRemoveEformModalComponent implements OnInit {
  private eFormService = inject(EFormService);
  dialogRef = inject<MatDialogRef<EformRemoveEformModalComponent>>(MatDialogRef);
  selectedTemplateDto = inject<TemplateDto>(MAT_DIALOG_DATA) ?? new TemplateDto();


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
