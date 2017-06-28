import {CaseDataItem} from './data-item.model';
import {CaseDataItemGroup} from './data-item-group.model';

export class CaseElement {
  id: number;
  label: string;
  status: string;
  reviewEnabled: boolean;
  approvalEnabled: boolean;
  extraFieldsEnabled: boolean;
  dataItemList: Array<CaseDataItem> = [];
  dataItemGroupList: Array<CaseDataItemGroup> = [];
  elementList: Array<CaseElement> = [];
}
