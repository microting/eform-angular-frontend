import {DashboardAnswerDatesModel, DashboardItemModel} from 'src/app/plugins/modules/insight-dashboard-pn/models';

export class DashboardItemPreviewRequestModel {
  item: DashboardItemModel;
  dashboardPreviewInfo: DashboardPreviewInfoModel;
}

export class DashboardPreviewInfoModel {
  dashboardId: number;
  locationId: number;
  tagId: number;
  answerDates: DashboardAnswerDatesModel = new DashboardAnswerDatesModel;
}
