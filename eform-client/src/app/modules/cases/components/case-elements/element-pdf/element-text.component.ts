import {Component, Input, OnInit} from '@angular/core';
import {CaseDataItem} from 'app/models';

@Component({
  selector: 'element-pdf',
  templateUrl: './element-text.component.html'
})
export class ElementPdfComponent implements OnInit {
  dataItemObj: CaseDataItem = new CaseDataItem();

  @Input()
  get dataItem() {
    return this.dataItem;
  }

  set dataItem(val) {
    this.dataItemObj = val;
  }

  constructor() {
  }

  ngOnInit() {
  }

}
