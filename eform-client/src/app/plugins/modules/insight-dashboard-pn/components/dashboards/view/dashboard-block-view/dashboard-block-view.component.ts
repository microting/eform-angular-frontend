import {Component, Input, OnInit} from '@angular/core';
import {DashboardChartTypesEnum, DashboardItemQuestionTypesEnum, DashboardPeriodUnitsEnum} from '../../../../const/enums';
import {DashboardViewItemModel} from '../../../../models/dashboard/dashboard-view/dashboard-view-item.model';
import {DashboardViewModel} from '../../../../models';

@Component({
  selector: 'app-dashboard-block-view',
  templateUrl: './dashboard-block-view.component.html',
  styleUrls: ['./dashboard-block-view.component.scss']
})
export class DashboardBlockViewComponent implements OnInit {
  @Input() position: number;
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();
  @Input() dashboardViewModel: DashboardViewModel = new DashboardViewModel();

  get chartTypes() { return DashboardChartTypesEnum; }
  get periodUnits() { return DashboardPeriodUnitsEnum; }
  get questionType() { return DashboardItemQuestionTypesEnum; }


  constructor() { }

  ngOnInit() {
  }

}
