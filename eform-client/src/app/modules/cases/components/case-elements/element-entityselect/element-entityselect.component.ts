import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'app/models';

@Component({
  selector: 'element-entityselect',
  templateUrl: './element-entityselect.component.html',
  styleUrls: ['./element-entityselect.component.css']
})
export class ElementEntityselectComponent implements OnInit {
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
