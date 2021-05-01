export class ItemsListCasePnModel {
  total: number;
  items: Array<ItemsListPnItemCaseModel> = [];
}

export class ItemsListPnItemCaseModel {
  id: number;
  date: string;
  name: string;
  description: string;
  itemNumber: string;
  locationCode: string;
  buildYear: string;
  type: string;
  location: string;
  status: number;
  fieldStatus: string;
  comment: string;
  numberOfImages: number;
  sdkCaseId: number;
  sdkeFormId: number;
}
