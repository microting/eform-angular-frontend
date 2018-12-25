import {Component, Input, OnInit} from '@angular/core';
import {DataItemDto} from 'src/app/common/models';

@Component({
  selector: 'element-pdf',
  templateUrl: './element-pdf.component.html',
  styleUrls: ['./element-pdf.component.scss']
})
export class ElementPdfComponent {
  dataItemObj: DataItemDto = new DataItemDto();

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
