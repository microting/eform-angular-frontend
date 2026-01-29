import { Component, Input} from '@angular/core';
import { DataItemDto } from 'src/app/common/models';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { CaseEditSwitchComponent } from '../../case-edit-switch/case-edit-switch.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-container',
    templateUrl: './element-container.component.html',
    styleUrls: ['./element-container.component.scss'],
    imports: [MatCard, MatCardHeader, MatIcon, MatCardContent, NgClass, CaseEditSwitchComponent]
})
export class ElementContainerComponent {
  dataItemList: Array<DataItemDto> = [];
  isCollapsed = true;
  @Input() dataItemLabel: string;
  @Input()
  get fieldValue() {
    return this.dataItemList;
  }
  set fieldValue(val) {
    this.dataItemList = val;
  }

  constructor() {}
}
