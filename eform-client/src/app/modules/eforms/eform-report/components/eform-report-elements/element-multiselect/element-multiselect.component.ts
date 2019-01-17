import {Component, Input, OnInit} from '@angular/core';
import {EformReportDataItemValue, FieldValueDto} from 'src/app/common/models';

@Component({
  selector: 'report-element-multiselect',
  templateUrl: './element-multiselect.component.html',
  styleUrls: ['./element-multiselect.component.scss']
})
export class ElementMultiselectComponent implements OnInit {
  fieldValueObj: EformReportDataItemValue = new EformReportDataItemValue();

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
