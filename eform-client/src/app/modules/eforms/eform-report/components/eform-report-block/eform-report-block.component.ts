import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {EformReportDataItem, EformReportElement} from 'src/app/common/models';

@Component({
  selector: 'app-eform-report-block',
  templateUrl: './eform-report-block.component.html',
  styleUrls: ['./eform-report-block.component.scss']
})
export class EformReportBlockComponent implements OnInit {
  @Input() element: EformReportElement = new EformReportElement();
  @Output() onElementVisibilityChanged: EventEmitter<{id: number, visibility: boolean}> =
    new EventEmitter<{id: number, visibility: boolean}>();
  @Output() elementChanged: EventEmitter<EformReportElement> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onDataItemListChanged(e: EformReportDataItem[]) {
    this.element.dataItemList = e;
    this.elementChanged.emit(this.element);
  }
}
