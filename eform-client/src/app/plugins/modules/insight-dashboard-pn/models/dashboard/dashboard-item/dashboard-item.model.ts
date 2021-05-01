import {DashboardChartTypesEnum, DashboardItemQuestionTypesEnum, DashboardPeriodUnitsEnum} from '../../../const/enums';
import {DashboardItemCompareModel} from './dashboard-item-compare.model';
import {DashboardItemIgnoredAnswerModel} from './dashboard-item-ignored-answer.model';
import {DashboardChartDataModel} from 'src/app/plugins/modules/insight-dashboard-pn/models/dashboard/dashboard-chart-data.model';

export class DashboardItemModel {
  id: number;
  firstQuestionId: number;
  firstQuestionType: DashboardItemQuestionTypesEnum;
  filterQuestionId: number;
  filterAnswerId: number;
  filterAnswerName: string;
  ignoredAnswerValues: DashboardItemIgnoredAnswerModel[];
  period: DashboardPeriodUnitsEnum;
  chartType: DashboardChartTypesEnum;

  compareEnabled: boolean;
  compareLocationsTags: DashboardItemCompareModel[];

  calculateAverage: boolean;
  calculateByWeight: boolean;

  position: number;
  answersLength = 0;

  // Helper fields
  collapsed: boolean;
  chartData: DashboardChartDataModel;
}

