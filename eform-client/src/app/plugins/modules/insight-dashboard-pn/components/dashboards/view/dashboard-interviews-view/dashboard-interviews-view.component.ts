import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DashboardViewItemModel} from '../../../../models/dashboard/dashboard-view/dashboard-view-item.model';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {InsightDashboardPnDashboardItemsService} from '../../../../services';
import {saveAs} from 'file-saver';
import {DashboardViewModel} from '../../../../models';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-interviews-view',
  templateUrl: './dashboard-interviews-view.component.html',
  styleUrls: ['./dashboard-interviews-view.component.scss']
})
export class DashboardInterviewsViewComponent implements OnInit, OnDestroy {
  @Input() dashboardViewModel: DashboardViewModel = new DashboardViewModel();
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel;
  exportSub$: Subscription;

  constructor(private dashboardItemsService: InsightDashboardPnDashboardItemsService) {
  }

  ngOnInit() {
  }

  exportToCsv() {
    this.exportSub$ = this.dashboardItemsService.exportInterviewsToExcel({
      dashboardId: this.dashboardViewModel.id,
      itemId: this.itemModel.id
    }).subscribe(data => {
      const blob = new Blob([data]);
      saveAs(blob, `${this.dashboardViewModel.dashboardName}_interviews.xlsx`);
    });
  }

  ngOnDestroy(): void {
  }

}
