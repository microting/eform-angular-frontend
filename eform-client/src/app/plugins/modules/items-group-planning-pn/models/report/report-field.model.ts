import {ReportFieldOptionModel} from './report-field-option.model';

export class ReportFieldModel {
  dataItemId: number;
  label: string;
  options: Array<ReportFieldOptionModel> = [];
}
