import {EformReportElementModel} from './eform-report-element.model';

export class EformReportModel {
  templateId: number;
  headerImage: string;
  description: string;
  isWorkerNameVisible: boolean;
  isDateVisible: boolean;
  elements: Array<EformReportElementModel> = [];
}
