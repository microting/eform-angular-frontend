import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {Subject} from 'rxjs';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-case-edit-confirmation',
    templateUrl: './case-edit-confirmation.component.html',
    styleUrls: ['./case-edit-confirmation.component.scss'],
    standalone: false
})
export class CaseEditConfirmationComponent implements OnInit {
  dialogRef = inject<MatDialogRef<CaseEditConfirmationComponent>>(MatDialogRef);

  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();
  onConfirmationPressed: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
  }

  hide() {
    this.dialogRef.close();
  }

  confirmationClicked(keepData: boolean) {
    this.onConfirmationPressed.emit(keepData);
    this.hide();
  }

  cancelExit() {
    this.hide();
    this.navigateAwaySelection$.next(false);
  }
}
