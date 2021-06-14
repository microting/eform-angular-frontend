import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CaseModel} from 'src/app/common/models/cases';
import {CasesService} from 'src/app/common/services/cases';

@Component({
  selector: 'app-case-remove-modal',
  templateUrl: './case-remove-modal.component.html',
  styleUrls: ['./case-remove-modal.component.scss']
})
export class CaseRemoveModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() onCaseDeleted: EventEmitter<void> = new EventEmitter<void>();
  selectedTemplateId: number;
  selectedCaseModel: CaseModel = new CaseModel();

  constructor(private casesService: CasesService) { }

  ngOnInit() {
  }

  show(caseModel: CaseModel, templateId: number) {
    this.selectedCaseModel = caseModel;
    this.selectedTemplateId = templateId;
    this.frame.show();
  }

  submitCaseDelete() {
    this.casesService.deleteCase(this.selectedCaseModel.id, this.selectedTemplateId).subscribe((data => {
      if (data && data.success) {
        this.onCaseDeleted.emit();
        this.frame.hide();
      }
    }));
  }
}
