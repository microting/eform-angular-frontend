import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'app/models';

@Component({
  selector: 'element-entitysearch',
  templateUrl: './element-entitysearch.component.html',
  styleUrls: ['./element-entitysearch.component.css']
})
export class ElementEntitySearchComponent implements OnInit {
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
