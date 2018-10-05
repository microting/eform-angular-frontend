import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-case-edit-confirmation',
  templateUrl: './case-edit-confirmation.component.html',
  styleUrls: ['./case-edit-confirmation.component.scss']
})
export class CaseEditConfirmationComponent implements OnInit {
  @ViewChild('frame') frame;
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();
  @Output() onConfirmationPressed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  confirmationClicked(keepData: boolean) {
    this.onConfirmationPressed.emit(keepData);
    this.frame.hide();
  }

}
