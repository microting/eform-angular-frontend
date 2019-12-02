import {Component, Input, OnInit} from '@angular/core';
import {differenceInSeconds} from 'date-fns';
import {FieldValueDto} from 'src/app/common/models';

@Component({
  selector: 'element-timer',
  templateUrl: './element-timer.component.html',
  styleUrls: ['./element-timer.component.scss']
})
export class ElementTimerComponent implements OnInit {
  fieldValueObj: FieldValueDto = new FieldValueDto();
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
      let durationInSeconds = 0;
      if (this.startDate !== '' && this.endDate !== '') {
        durationInSeconds = Math.abs(differenceInSeconds(new Date(this.endDate), new Date(this.startDate)));
      }
      this.duration = new Date(durationInSeconds * 1000).toISOString().substr(11, 8);
    }
  }
}
