import {Component, Input, OnInit} from '@angular/core';
import {differenceInMinutes, format} from 'date-fns';
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
      const duration = differenceInMinutes(new Date(this.startDate), new Date(this.endDate));
      this.duration = format(Math.abs(duration), 'HH:mm:ss');
    }
  }
}
