import { Component, OnInit, Input } from '@angular/core';
import { StatusBarModel} from '../../../../models/common';

@Component({
  selector: 'status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit {
  statusBar: StatusBarModel = new StatusBarModel();
  constructor() { }
  @Input()
  get status() {
    return this.statusBar.status;
  }
  set status(status: number) {
    this.statusBar.status = status;
  }

 ngOnInit() {
  }

}
