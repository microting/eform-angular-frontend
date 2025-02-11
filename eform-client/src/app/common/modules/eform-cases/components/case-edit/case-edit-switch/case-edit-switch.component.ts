import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataItemDto} from 'src/app/common/models';

@Component({
    selector: 'app-case-edit-switch',
    templateUrl: './case-edit-switch.component.html',
    styleUrls: ['./case-edit-switch.component.scss'],
    standalone: false
})
export class CaseEditSwitchComponent implements OnInit {
  @Input() dataItemList: Array<DataItemDto> = [];
  @Output() needUpdate: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  emitNeedUpdate() {
    this.needUpdate.emit();
  }
}
