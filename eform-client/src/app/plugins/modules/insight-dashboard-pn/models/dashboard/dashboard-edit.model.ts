import {DashboardItemModel} from './dashboard-item/dashboard-item.model';
import {DashboardAnswerDatesModel} from './dashboard-answer-dates.model';

export class DashboardEditModel {
  id: number;
  dashboardName: string;
  answerDates: DashboardAnswerDatesModel = new DashboardAnswerDatesModel;
  surveyId: number;
  surveyName: string;
  locationName: string;
  locationId: number;
  tagName: string;
  tagId: number;
  items: DashboardItemModel[] = [];
}
