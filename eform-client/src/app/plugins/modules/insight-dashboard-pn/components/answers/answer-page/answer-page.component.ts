import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { InsightDashboardPnAnswersService } from '../../../services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { AnswerModel } from '../../../models/answer';
import { AnswerDeleteModalComponent } from '../answer-delete-modal/answer-delete-modal.component';

@AutoUnsubscribe()
@Component({
  selector: 'app-answer-page',
  templateUrl: './answer-page.component.html',
  styleUrls: ['./answer-page.component.scss'],
})
export class AnswerPageComponent implements OnInit, OnDestroy {
  @ViewChild('answerDeleteModal', { static: true })
  answerDeleteModal: AnswerDeleteModalComponent;
  searchAnswerMicrotingUId: number;
  answerSub$: Subscription;
  deleteAnswerSub$: Subscription;
  answer: AnswerModel = new AnswerModel();
  searchAnswerId: string;

  constructor(private answersService: InsightDashboardPnAnswersService) {}

  ngOnInit(): void {}

  openAnswerDeleteModal() {
    this.answerDeleteModal.show();
  }

  getAnswer() {
    this.answer = new AnswerModel();
    this.searchAnswerId = this.searchAnswerId.replace(/\./g, '');
    this.searchAnswerMicrotingUId = parseInt(this.searchAnswerId, 10);
    this.answerSub$ = this.answersService
      .getAnswer(this.searchAnswerMicrotingUId)
      .subscribe((data) => {
        if (data && data.success) {
          this.answer = data.model;
        }
      });
  }

  deleteAnswer() {
    this.deleteAnswerSub$ = this.answersService
      .deleteAnswer(this.answer.microtingUid)
      .subscribe(() => {
        this.answer = new AnswerModel();
        this.searchAnswerMicrotingUId = null;
        this.answerDeleteModal.hide();
      });
  }

  ngOnDestroy(): void {
  }
}
