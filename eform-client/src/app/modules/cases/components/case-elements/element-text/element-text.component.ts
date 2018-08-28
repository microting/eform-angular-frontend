import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'src/app/common/models/cases';

@Component({
  selector: 'element-text',
  templateUrl: './element-text.component.html',
  styleUrls: ['./element-text.component.scss']
})
export class ElementTextComponent  {
  fieldValueObj: CaseFieldValue = new CaseFieldValue();

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  constructor() {
  }

}
