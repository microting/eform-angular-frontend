import {Component, Input, OnInit} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';

@Component({
  selector: 'element-comment',
  templateUrl: './element-comment.component.html',
  styleUrls: ['./element-comment.component.scss']
})
export class ElementCommentComponent {
  fieldValueObj: FieldValueDto = new FieldValueDto();

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
