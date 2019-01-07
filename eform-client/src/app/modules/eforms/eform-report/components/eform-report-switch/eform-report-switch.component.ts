import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {DataItemDto} from 'src/app/common/models';

@Component({
  selector: 'app-eform-report-switch',
  templateUrl: './eform-report-switch.component.html',
  styleUrls: ['./eform-report-switch.component.scss']
})
export class EformReportSwitchComponent implements OnInit {
  @Input() dataItemList: Array<DataItemDto> = [];
  @Input() dragulaContainerName = '';
  @Output() onElementVisibilityChanged: EventEmitter<{id: number, visibility: boolean}> =
    new EventEmitter<{id: number, visibility: boolean}>();

  visibilityTest = false;
  constructor(private dragulaService: DragulaService) { }

  ngOnInit() {
    this.dragulaService.createGroup(this.dragulaContainerName, {
      removeOnSpill: false,
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      }
    });
  }

}
