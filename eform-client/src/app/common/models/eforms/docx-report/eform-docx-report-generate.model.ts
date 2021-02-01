export class EformDocxReportGenerateModel {
  dateFrom: string;
  dateTo: string;
  templateId: number;

  constructor(data?: any) {
    if (data) {
      this.dateFrom = data.dateFrom;
      this.dateTo = data.dateTo;
      this.templateId = data.templateId;
    }
  }
}
