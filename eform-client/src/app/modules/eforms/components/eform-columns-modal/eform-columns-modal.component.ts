import { Component, OnInit, inject } from '@angular/core';
import {TemplateColumnModel, UpdateColumnsModel} from 'src/app/common/models/cases';
import {TemplateDto} from 'src/app/common/models/dto';
import {EFormService} from 'src/app/common/services/eform';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MtxSelect } from '@ng-matero/extensions/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-eform-column-modal',
    templateUrl: './eform-columns-modal.component.html',
    styleUrls: ['./eform-columns-modal.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MtxSelect, ReactiveFormsModule, FormsModule, MatDialogActions, TranslatePipe]
})
export class EformColumnsModalComponent implements OnInit {
  private eFormService = inject(EFormService);
  dialogRef = inject<MatDialogRef<EformColumnsModalComponent>>(MatDialogRef);
  selectedTemplateDto = inject<TemplateDto>(MAT_DIALOG_DATA);

  columnEditModel: UpdateColumnsModel = new UpdateColumnsModel;
  columnModels: Array<TemplateColumnModel> = [];

  ngOnInit() {
    this.getColumnsForTemplate();
    this.dialogRef.updateSize('100%');
  }

  getColumnsForTemplate() {
    this.eFormService.getTemplateColumns(this.selectedTemplateDto.id).subscribe((operation) => {
      if (operation && operation.success) {
        this.columnModels = operation.model;
        this.eFormService.getCurrentTemplateColumns(this.selectedTemplateDto.id).subscribe((result) => {
          if (result && result.success) {
            this.columnEditModel = result.model;
          }
        });
      }
    });
  }

  updateColumns() {
    this.columnEditModel.templateId = this.selectedTemplateDto.id;
    this.eFormService.updateTemplateColumns(this.columnEditModel).subscribe((data => {
      if (data && data.success) {
        this.hide(true);
      }
    }));
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }
}
