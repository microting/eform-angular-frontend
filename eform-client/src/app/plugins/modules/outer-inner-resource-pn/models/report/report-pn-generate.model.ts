export class ReportPnGenerateModel {
  type: number;
  relationship: number;
  dateTo: string;
  dateFrom: string;

  constructor(data?: any) {
    if (data) {
      this.type = data.type;
      this.relationship = data.relationship;
      this.dateTo = data.dateTo;
      this.dateFrom = data.dateFrom;
    }
  }
}
