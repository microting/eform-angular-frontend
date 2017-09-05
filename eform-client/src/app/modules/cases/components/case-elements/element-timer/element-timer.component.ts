import {Component, Input, OnInit} from '@angular/core';
import {CaseFieldValue} from 'app/models';
import * as moment from 'moment';

@Component({
  selector: 'element-timer',
  templateUrl: './element-timer.component.html',
})
export class ElementTimerComponent implements OnInit {
  fieldValueObj: CaseFieldValue = new CaseFieldValue();
  dateArray = [];
  startDate: string;
  endDate: string;
  duration: string;

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
    this.dateArray = this.fieldValue.value.split('|', 2);
    if (this.dateArray.length > 1) {
      this.startDate = this.dateArray[0];
      this.endDate = this.dateArray[1];
      const duration = moment(new Date(this.startDate)).diff(moment(new Date(this.endDate)));
      this.duration = moment.utc(Math.abs(duration)).format('HH:mm:ss');
    }
  }

}
