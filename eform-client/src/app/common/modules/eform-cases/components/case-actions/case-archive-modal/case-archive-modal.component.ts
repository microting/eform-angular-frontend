import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {CaseArchiveModel,} from 'src/app/common/models';
import {CasesService} from 'src/app/common/services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@AutoUnsubscribe()
@Component({
    selector: 'app-case-archive-modal',
    templateUrl: './case-archive-modal.component.html',
    styleUrls: ['./case-archive-modal.component.scss'],
    standalone: false
})
export class CaseArchiveModalComponent implements OnInit, OnDestroy {
  constructor(
    private casesService: CasesService,
    public dialogRef: MatDialogRef<CaseArchiveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public caseArchiveModel: CaseArchiveModel = new CaseArchiveModel()
  ) {
  }

  ngOnInit() {
  }

  submitCaseToArchive() {
    this.caseArchiveModel.isArchived
      ? this.casesService
        .unArchiveCase(this.caseArchiveModel.id)
        .subscribe((data) => {
          if (data && data.success) {
            this.hide(true);
          }
        })
      : this.casesService
        .archiveCase(this.caseArchiveModel.id)
        .subscribe((data) => {
          if (data && data.success) {
            this.hide(true);
          }
        });
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {
  }
}
