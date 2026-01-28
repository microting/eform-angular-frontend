import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {CaseModel} from 'src/app/common/models/cases';
import {CasesService} from 'src/app/common/services/cases';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgIf } from '@angular/common';
import { DateFormatterComponent } from '../../../../eform-shared/components/date-formatter/date-formatter.component';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-case-remove-modal',
    templateUrl: './case-remove-modal.component.html',
    styleUrls: ['./case-remove-modal.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, NgIf, DateFormatterComponent, MatDialogActions, MatButton, TranslatePipe]
})
export class CaseRemoveModalComponent implements OnInit {
  private casesService = inject(CasesService);
  dialogRef = inject<MatDialogRef<CaseRemoveModalComponent>>(MatDialogRef);
  private model = inject<{
    caseModel: CaseModel;
    templateId: number;
}>(MAT_DIALOG_DATA);

  selectedTemplateId: number;
  selectedCaseModel: CaseModel = new CaseModel();

  constructor() {
    const model = this.model;

    this.selectedCaseModel = model.caseModel;
    this.selectedTemplateId = model.templateId;
  }

  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  submitCaseDelete() {
    this.casesService.deleteCase(this.selectedCaseModel.id, this.selectedTemplateId).subscribe((data => {
      if (data && data.success) {
        this.hide(true);
      }
    }));
  }
}
