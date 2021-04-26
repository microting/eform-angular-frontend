import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EformReportDataItem, EformReportElement} from 'src/app/common/models';
import {UUID} from 'angular2-uuid';

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
  dragulaElementContainerName = UUID.UUID();

  constructor() { }

  ngOnInit() {
  }

  onDataItemListChanged(e: EformReportDataItem[]) {
    this.element.dataItemList = e;
    this.elementChanged.emit(this.element);
  }
}
