import {Component, Input, OnInit} from '@angular/core';
import {CaseDataItem} from 'src/app/common/models/cases';

@Component({
  selector: 'app-case-edit-switch',
  templateUrl: './case-edit-switch.component.html',
  styleUrls: ['./case-edit-switch.component.scss']
})
export class CaseEditSwitchComponent implements OnInit {
  @Input() dataItemList: Array<CaseDataItem> = [];
  constructor() { }

  ngOnInit() {
  }

}
