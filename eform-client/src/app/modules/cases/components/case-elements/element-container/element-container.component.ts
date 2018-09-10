import {Component, Input, OnInit} from '@angular/core';
import {CaseDataItem} from 'src/app/common/models';

@Component({
  selector: 'element-container',
  templateUrl: './element-container.component.html',
  styleUrls: ['./element-container.component.scss']
})
export class ElementContainerComponent  {
  dataItemList: Array<CaseDataItem> = [];
  isCollapsed = true;
  @Input() dataItemLabel: string;
  @Input()
  get fieldValue() {
    return this.dataItemList;
  }
  set fieldValue(val) {
    this.dataItemList = val;
  }

  constructor() {
  }

}
