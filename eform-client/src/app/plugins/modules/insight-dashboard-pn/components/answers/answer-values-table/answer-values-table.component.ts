import {Component, Input, OnInit} from '@angular/core';
import {AnswerModel, AnswerValuesModel} from '../../../models/answer';

@Component({
  selector: 'app-answer-values-table',
  templateUrl: './answer-values-table.component.html',
  styleUrls: ['./answer-values-table.component.scss']
})
export class AnswerValuesTableComponent implements OnInit {
  @Input() answerModel: AnswerModel;
  constructor() { }

  ngOnInit(): void {
  }

}
