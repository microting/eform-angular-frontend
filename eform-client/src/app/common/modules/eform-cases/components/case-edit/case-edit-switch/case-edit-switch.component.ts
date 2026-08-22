import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataItemDto} from 'src/app/common/models';

@Component({
    selector: 'app-case-edit-switch',
    templateUrl: './case-edit-switch.component.html',
    standalone: false
})
export class CaseEditSwitchComponent implements OnInit {
  @Input() dataItemList: Array<DataItemDto> = [];
  @Output() needUpdate: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * A FieldContainer is a grouping construct, not a question — it must not draw
   * an accent bar around the whole group, and must not set the custom property
   * either (it would inherit into the nested fields).
   */
  isAccented(dataItem: DataItemDto): boolean {
    return dataItem.fieldType !== 'FieldContainer' && !!dataItem.color;
  }

  emitNeedUpdate() {
    this.needUpdate.emit();
  }
}
