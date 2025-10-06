import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {CaseModel} from 'src/app/common/models/cases';
import {CasesService} from 'src/app/common/services/cases';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-case-remove-modal',
    templateUrl: './case-remove-modal.component.html',
    styleUrls: ['./case-remove-modal.component.scss'],
    standalone: false
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
