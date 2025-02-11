import {Component, OnInit, Input} from '@angular/core';
import {StatusBarModel} from 'src/app/common/models';
import {CaseStatusEnum} from 'src/app/common/const';

@Component({
    selector: 'status-bar',
    templateUrl: './status-bar.component.html',
    styleUrls: ['./status-bar.component.scss'],
    standalone: false
})
export class StatusBarComponent implements OnInit {
  statusBar: StatusBarModel = new StatusBarModel();

  constructor() {
  }

  @Input()
  get status() {
    return this.statusBar.status;
  }

  set status(status: CaseStatusEnum) {
    this.statusBar.status = status;
  }

  get statusText(): string {
    switch (this.statusBar.status) {
      case CaseStatusEnum.SavedLocally:
        return 'Saved locally';
      case CaseStatusEnum.ReadyForServer:
        return 'Ready for server';
      case CaseStatusEnum.ReceivedByServer:
        return 'Received by server';
      case CaseStatusEnum.ReadyForDevice:
        return 'Ready for device';
      case CaseStatusEnum.RetrievedByDevice:
        return 'Retrieved by device';
      case CaseStatusEnum.Completed:
        return 'Completed';
      case CaseStatusEnum.SystemError:
        return 'System error: Contact Microting';
    }
  }

  ngOnInit() {
  }
}
