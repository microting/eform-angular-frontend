import {DataItemDto} from './data-item.dto';

export class ElementDto {
  id: number;
  label: string;
  status: string;
  reviewEnabled: boolean;
  approvalEnabled: boolean;
  extraFieldsEnabled: boolean;
  dataItemList: Array<DataItemDto> = [];
  // dataItemGroupList: Array<CaseDataItemGroup> = [];
  elementList: Array<ElementDto> = [];
}
