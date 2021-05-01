import {DashboardViewItemModel} from './dashboard-view-item.model';
import {DashboardAnswerDatesModel} from '../dashboard-answer-dates.model';

export class DashboardViewModel {
  id: number;
  dashboardName: string;
  surveyName: string;
  surveyId: number;
  answerDates: DashboardAnswerDatesModel;
  locationName: string;
  locationId: number | null;
  tagName: string;
  tagId: number | null;
  items: DashboardViewItemModel[];
}
