import { Component, Input} from '@angular/core';
import {format, set} from 'date-fns';
import { FieldValueDto } from 'src/app/common/models';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-date',
    templateUrl: './element-date.component.html',
    styleUrls: ['./element-date.component.scss'],
    standalone: false
})
export class ElementDateComponent {
  fieldValueObj: FieldValueDto = new FieldValueDto();

  constructor() {
  }

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  onDateSelected(e: MatDatepickerInputEvent<any, any>) {
    let date = e.value;
    date = format(set(date, {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      date: date.getDate(),
      year: date.getFullYear(),
      month: date.getMonth(),
    }), 'yyyy-MM-dd');
    this.fieldValueObj.value = date;
  }
}
