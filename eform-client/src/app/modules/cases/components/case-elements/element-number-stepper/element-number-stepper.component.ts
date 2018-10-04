import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'src/app/common/models/cases';

@Component({
  selector: 'element-number',
  templateUrl: './element-number-stepper.component.html',
  styleUrls: ['./element-number-stepper.component.scss']
})
export class ElementNumberStepperComponent  {
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
