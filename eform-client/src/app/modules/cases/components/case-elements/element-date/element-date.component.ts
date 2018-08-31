import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'src/app/common/models/cases';

@Component({
  selector: 'element-date',
  templateUrl: './element-date.component.html',
  styleUrls: ['./element-date.component.scss']
})
export class ElementDateComponent {
  fieldValueObj: CaseFieldValue = new CaseFieldValue();

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

}
