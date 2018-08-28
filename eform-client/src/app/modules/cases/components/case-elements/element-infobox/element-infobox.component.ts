import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'src/app/common/models/cases';

@Component({
  selector: 'element-infobox',
  templateUrl: './element-infobox.component.html',
  styleUrls: ['./element-infobox.component.scss']
})
export class ElementInfoboxComponent {
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
