import {CaseDataItem} from 'app/models';

export class CaseDataItemGroup {
  id: number;
  label: string;
  description: string;
  color: string;
  displayOrder: number;
  dataItemList: Array<CaseDataItem> = [];
}
