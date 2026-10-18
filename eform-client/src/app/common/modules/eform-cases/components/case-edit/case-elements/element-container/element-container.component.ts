import { Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
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
    imports: [MatCard, MatCardHeader, MatIcon, MatCardContent, NgClass,
      // CaseEditSwitchComponent imports this component back (runtime cycle).
      forwardRef(() => CaseEditSwitchComponent)]
})
export class ElementContainerComponent {
  dataItemList: Array<DataItemDto> = [];
  isCollapsed = true;
  @Input() dataItemLabel: string;
  /**
   * Id of the case being edited, threaded on down to the nested switch so a
   * Picture field grouped inside this container still resolves a case id when
   * the editor is rendered inside a dialog rather than on a case route.
   */
  @Input() caseId?: number;
  @Input()
  get fieldValue() {
    return this.dataItemList;
  }
  set fieldValue(val) {
    this.dataItemList = val;
  }
  @Output() needUpdate: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  emitNeedUpdate() {
    this.needUpdate.emit();
  }
}
