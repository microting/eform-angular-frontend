import { Component, OnInit, Input } from '@angular/core';
import { CaseStatusEnum } from 'src/app/common/const';
import { StatusBarModel} from '../../../../models/common';

@Component({
    selector: 'status-bar-compact',
    templateUrl: './status-bar-compact.component.html',
    styleUrls: ['./status-bar-compact.component.scss'],
    standalone: false
})
export class StatusBarCompactComponent implements OnInit {
  statusBar: StatusBarModel = new StatusBarModel();
  tooltip = '';
  constructor() { }
  @Input()
  get status() {
    return this.statusBar.status;
  }
  set status(status: number) {
    this.statusBar.status = status;
    this.setTooltip();
  }

 ngOnInit() {
  }

  setTooltip() {
    switch (this.statusBar.status) {
      case CaseStatusEnum.SavedLocally:
        this.tooltip = 'SavedLocally';
        break;
      case CaseStatusEnum.ReadyForServer:
        this.tooltip = 'Ready for server';
        break;
      case CaseStatusEnum.ReceivedByServer:
        this.tooltip = 'Received by server';
        break;
      case CaseStatusEnum.ReadyForDevice:
        this.tooltip = 'Ready for device';
        break;
      case CaseStatusEnum.RetrievedByDevice:
        this.tooltip = 'Retrieved by device';
        break;
      case CaseStatusEnum.Completed:
       this.tooltip = 'Completed';
        break;
      case CaseStatusEnum.SystemError:
        this.tooltip = 'System error: Contact Microting';
        break;
      default:
        this.tooltip = '';
        break;
    }
  }
}
