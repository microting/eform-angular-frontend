import {Component, Input} from '@angular/core';
import {CaseDataItem} from 'app/models';

@Component({
  selector: '[case-edit-switch]',
  templateUrl: './case-edit-switch.component.html'
})

export class CaseEditSwitchComponent {
  @Input() dataItemList: Array<CaseDataItem> = [];

  constructor() {
  }

  getStyleColorFromDataItem(dataItem: any) {
    let style = '';
    if (dataItem.Color) {
      style = '#' + dataItem.Color + '';
    }
    return style;
  }
}
