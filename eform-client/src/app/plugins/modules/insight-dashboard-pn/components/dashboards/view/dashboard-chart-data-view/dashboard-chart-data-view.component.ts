import {Component, Input, OnInit} from '@angular/core';
import {DashboardViewItemModel} from '../../../../models/dashboard/dashboard-view/dashboard-view-item.model';
import {DashboardChartTypesEnum} from 'src/app/plugins/modules/insight-dashboard-pn/const';

@Component({
  selector: 'app-dashboard-chart-data-view',
  templateUrl: './dashboard-chart-data-view.component.html',
  styleUrls: ['./dashboard-chart-data-view.component.scss']
})
export class DashboardChartDataViewComponent implements OnInit {
  @Input() itemModel: DashboardViewItemModel = new DashboardViewItemModel();
  darkTHeme: boolean;

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  constructor() {
    this.darkTHeme = localStorage.getItem('darkTheme') === 'true'; }

  ngOnInit() {
  }

}
