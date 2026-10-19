import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {CaseArchiveModel,} from 'src/app/common/models';
import {CasesService} from 'src/app/common/services';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DateFormatterComponent } from '../../../../eform-shared/components/date-formatter/date-formatter.component';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
    selector: 'app-case-archive-modal',
    templateUrl: './case-archive-modal.component.html',
    styleUrls: ['./case-archive-modal.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, DateFormatterComponent, MatDialogActions, MatButton, TranslatePipe]
})
export class CaseArchiveModalComponent implements OnInit, OnDestroy {
  private casesService = inject(CasesService);
  dialogRef = inject<MatDialogRef<CaseArchiveModalComponent>>(MatDialogRef);
  caseArchiveModel = inject<CaseArchiveModel>(MAT_DIALOG_DATA) ?? new CaseArchiveModel();


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
