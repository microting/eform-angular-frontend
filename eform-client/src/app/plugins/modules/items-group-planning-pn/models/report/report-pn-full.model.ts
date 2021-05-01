import {ReportFieldModel} from './report-field.model';

export class ReportPnFullModel {
  name: string;
  description: string;
  dateTo: string;
  dateFrom: string;
  dates: Array<string> = [];
  datesDoneAt: Array<string> = [];
  ids: Array<string> = [];
  doneBy: Array<string> = [];
  formFields: Array<ReportFieldModel> = [];
}
