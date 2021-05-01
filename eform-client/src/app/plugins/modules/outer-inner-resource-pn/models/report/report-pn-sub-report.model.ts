import {ReportEntityModel} from './report-entity.model';

export class ReportPnSubReportModel {
  entities: Array<ReportEntityModel> = [];
  totalTime: number;
  totalTimePerTimeUnit: number[];
}
