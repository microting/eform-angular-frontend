import {Component, Input, OnInit} from '@angular/core';
import {CaseDataItem} from 'src/app/common/models/cases';

@Component({
  selector: 'element-pdf',
  templateUrl: './element-pdf.component.html',
  styleUrls: ['./element-pdf.component.scss']
})
export class ElementPdfComponent {
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
}
