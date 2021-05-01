import {CommonDictionaryModel} from '../../../../../common/models/common';

export class DashboardModel {
  id: number;
  dashboardName: string;
  locationName: string;
  surveyId: number;
  surveyName: string;
  locationsName: string;
  locationId: number;
  tagName: string;
  tagId: number;
  dateFrom: Date | null;
  dateTo: Date | null;
}
