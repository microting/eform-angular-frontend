import { Component, OnInit, Input } from '@angular/core';
import { DateFormatterModel} from '../../../../models/common';
import {formatDate} from '@angular/common';

@Component({
    selector: 'date-formatter',
    templateUrl: './date-formatter.component.html',
    styleUrls: ['./date-formatter.component.scss'],
    standalone: false
})
export class DateFormatterComponent implements OnInit {
  dateFormatter: DateFormatterModel = new DateFormatterModel();
  format: string;
  constructor() { }

  @Input()
  get date() {
    return this.dateFormatter.date;
  }
  set date(format) {
    this.dateFormatter.date = format;
  }
  @Input()
  get Format() {
    return this.format;
  }
  set Format(format) {
    this.format = format;
  }
  ngOnInit() {
  }

}
