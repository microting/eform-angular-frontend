import {Component, Inject, OnInit} from '@angular/core';
import {TemplateColumnModel, UpdateColumnsModel} from 'src/app/common/models/cases';
import {TemplateDto} from 'src/app/common/models/dto';
import {EFormService} from 'src/app/common/services/eform';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-eform-column-modal',
  templateUrl: './eform-columns-modal.component.html',
  styleUrls: ['./eform-columns-modal.component.scss']
})
export class EformColumnsModalComponent implements OnInit {
  columnEditModel: UpdateColumnsModel = new UpdateColumnsModel;
  columnModels: Array<TemplateColumnModel> = [];

  constructor(
    private eFormService: EFormService,
    public dialogRef: MatDialogRef<EformColumnsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedTemplateDto: TemplateDto,) {
  }

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
