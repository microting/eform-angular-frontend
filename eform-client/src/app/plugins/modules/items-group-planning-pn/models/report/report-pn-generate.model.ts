export class ReportPnGenerateModel {
  itemList: number;
  item: number;
  dateTo: string;
  dateFrom: string;

  constructor(data?: any) {
    if (data) {
      this.itemList = data.itemList;
      this.item = data.item;
      this.dateTo = data.dateTo;
      this.dateFrom = data.dateFrom;
    }
  }
}
