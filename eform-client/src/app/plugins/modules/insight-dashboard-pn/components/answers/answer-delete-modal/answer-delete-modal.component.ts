import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-answer-delete-modal',
  templateUrl: './answer-delete-modal.component.html',
  styleUrls: ['./answer-delete-modal.component.scss'],
})
export class AnswerDeleteModalComponent implements OnInit {
  @Output() deleteAnswer: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;

  constructor() {}

  ngOnInit(): void {}

  hide() {
    this.frame.hide();
  }

  show() {
    this.frame.show();
  }

  delete() {
    this.deleteAnswer.emit();
  }
}
