import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'src/app/common/models/cases';

@Component({
  selector: 'element-comment',
  templateUrl: './element-comment.component.html',
  styleUrls: ['./element-comment.component.scss']
})
export class ElementCommentComponent {
  fieldValueObj: CaseFieldValue = new CaseFieldValue();

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  onValueChanged(e: any) {
    this.fieldValueObj = e;
  }

  constructor() {
  }

}
