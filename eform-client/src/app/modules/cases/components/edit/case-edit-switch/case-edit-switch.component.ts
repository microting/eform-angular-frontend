import {Component, Input, OnInit} from '@angular/core';
import {DataItemDto} from 'src/app/common/models';

@Component({
  selector: 'app-case-edit-switch',
  templateUrl: './case-edit-switch.component.html',
  styleUrls: ['./case-edit-switch.component.scss']
})
export class CaseEditSwitchComponent implements OnInit {
  @Input() dataItemList: Array<DataItemDto> = [];
  constructor() { }

  ngOnInit() {
  }

}
