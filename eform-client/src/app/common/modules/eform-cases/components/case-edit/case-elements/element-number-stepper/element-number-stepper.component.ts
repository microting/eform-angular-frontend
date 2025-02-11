import { Component, Input, OnInit } from '@angular/core';
import { FieldValueDto } from 'src/app/common/models';

@Component({
    selector: 'element-number-stepper',
    templateUrl: './element-number-stepper.component.html',
    styleUrls: ['./element-number-stepper.component.scss'],
    standalone: false
})
export class ElementNumberStepperComponent implements OnInit {
  fieldValueObj: FieldValueDto = new FieldValueDto();

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  constructor() {}

  ngOnInit() {}
}
