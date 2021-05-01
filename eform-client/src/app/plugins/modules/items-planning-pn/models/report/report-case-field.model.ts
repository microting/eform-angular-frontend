import {ReportFieldOptionModel} from './report-field-option.model';

export class ReportCaseFieldModel {
  dataItemId: number;
  label: string;
  options: Array<ReportFieldOptionModel> = [];
}
