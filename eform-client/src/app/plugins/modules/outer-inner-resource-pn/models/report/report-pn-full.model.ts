import {ReportEntityHeaderModel} from './report-entity-header.model';
import {ReportEntityModel} from './report-entity.model';
import {ReportPnSubReportModel} from './report-pn-sub-report.model';

export class ReportPnFullModel {
  reportHeaders: Array<ReportEntityHeaderModel> = [];
  subReports: Array<ReportPnSubReportModel> = [];
  relationship: number;
  // totalTime: number;
  // totalTimePerTimeUnit: number[];
}
