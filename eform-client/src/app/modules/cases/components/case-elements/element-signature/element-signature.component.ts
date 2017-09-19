import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'app/models';

@Component({
  selector: 'element-signature',
  templateUrl: './element-signature.component.html',
})
export class ElementSignatureComponent implements OnInit {
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
