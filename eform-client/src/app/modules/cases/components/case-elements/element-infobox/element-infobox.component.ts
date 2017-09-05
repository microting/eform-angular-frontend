import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'app/models';

@Component({
  selector: 'element-infobox',
  templateUrl: './element-infobox.component.html',
})
export class ElementInfoboxComponent implements OnInit {
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

  ngOnInit() {
  }


}
