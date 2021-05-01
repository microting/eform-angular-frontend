import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import {DashboardModel} from '../../../../models';

@Component({
  selector: 'app-dashboard-copy',
  templateUrl: './dashboard-copy.component.html',
  styleUrls: ['./dashboard-copy.component.scss']
})
export class DashboardCopyComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() dashboardCopied: EventEmitter<void> = new EventEmitter<void>()
  dashboard: DashboardModel = new DashboardModel();

  constructor(private dashboardService: InsightDashboardPnDashboardsService) { }

  show(model: DashboardModel) {
    this.dashboard = model;
    this.frame.show();
  }

  ngOnInit() {
  }

  copyDashboard() {
    this.dashboardService.copy(this.dashboard.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.dashboardCopied.emit();
        }
      });
  }
}
