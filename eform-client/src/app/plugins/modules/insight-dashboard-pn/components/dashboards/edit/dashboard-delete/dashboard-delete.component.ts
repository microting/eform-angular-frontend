import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DashboardModel } from '../../../../models';
import { InsightDashboardPnDashboardsService } from '../../../../services';
import { DashboardsStateService } from 'src/app/plugins/modules/insight-dashboard-pn/components/dashboards/state/dashboards-state-service';

@Component({
  selector: 'app-dashboard-delete',
  templateUrl: './dashboard-delete.component.html',
  styleUrls: ['./dashboard-delete.component.scss'],
})
export class DashboardDeleteComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() dashboardDeleted: EventEmitter<void> = new EventEmitter<void>();
  dashboard: DashboardModel = new DashboardModel();

  constructor(private dashboardService: InsightDashboardPnDashboardsService) {}

  show(model: DashboardModel) {
    this.dashboard = model;
    this.frame.show();
  }

  ngOnInit() {}

  deleteDashboard() {
    this.dashboardService.remove(this.dashboard.id).subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.dashboardDeleted.emit();
      }
    });
  }
}
