export class EformReportElementModel {
  elementId: number;
  position: number;
  visibility: boolean;
  nestedElements: Array<EformReportElementModel> = [];
}
