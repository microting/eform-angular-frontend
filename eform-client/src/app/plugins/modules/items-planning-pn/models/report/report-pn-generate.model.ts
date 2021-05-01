export class ReportPnGenerateModel {
  dateTo: string;
  dateFrom: string;
  tagIds: number[];

  constructor(data?: any) {
    if (data) {
      this.dateTo = data.dateTo;
      this.dateFrom = data.dateFrom;
      this.tagIds = data.tagIds;
    }
  }
}
