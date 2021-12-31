import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { DataItemDto, EformReportDataItem } from 'src/app/common/models';

@Component({
  selector: 'app-eform-report-switch',
  templateUrl: './eform-report-switch.component.html',
  styleUrls: ['./eform-report-switch.component.scss'],
})
export class EformReportSwitchComponent implements OnInit {
  @Input() dataItemList: Array<EformReportDataItem> = [];
  @Input() dragulaContainerName = 'dataItems';
  @Output() dataItemListChanged: EventEmitter<
    Array<EformReportDataItem>
  > = new EventEmitter();

  visibilityTest = false;
  constructor(private dragulaService: DragulaService) {}

  ngOnInit() {
    this.dragulaService.createGroup(this.dragulaContainerName, {
      removeOnSpill: false,
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      },
      copy: (el, source) => {
        return source.id === this.dragulaContainerName;
      },
      copyItem: (customItem: any) => {
        return new DataItemDto();
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target.id !== this.dragulaContainerName;
      },
    });
  }

  onDataItemListChanged(e: any[]) {
    this.dataItemList = e;
    this.dataItemListChanged.emit(this.dataItemList);
  }

  onVisibilityChanged(id: number, visibility: boolean) {
    const itemIndex = this.dataItemList.findIndex((x) => x.id === id);
    this.dataItemList[itemIndex].visibility = visibility;
    this.dataItemListChanged.emit(this.dataItemList);
  }
}
