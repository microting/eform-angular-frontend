import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { CaseArchiveModel, CaseModel } from 'src/app/common/models';
import { CasesService } from 'src/app/common/services';

@AutoUnsubscribe()
@Component({
  selector: 'app-case-archive-modal',
  templateUrl: './case-archive-modal.component.html',
  styleUrls: ['./case-archive-modal.component.scss'],
})
export class CaseArchiveModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', { static: true }) frame;
  @Output() caseArchived: EventEmitter<void> = new EventEmitter<void>();
  caseArchiveModel: CaseArchiveModel = new CaseArchiveModel();

  constructor(private casesService: CasesService) {}

  ngOnInit() {}

  show(model: CaseArchiveModel) {
    this.caseArchiveModel = { ...model };
    this.frame.show();
  }

  submitCaseToArchive() {
    this.casesService
      .archiveCase(this.caseArchiveModel.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.caseArchived.emit();
          this.frame.hide();
        }
      });
  }

  ngOnDestroy(): void {}
}
