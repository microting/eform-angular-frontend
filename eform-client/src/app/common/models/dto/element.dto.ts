import {DataItemDto} from './data-item.dto';
import {FieldValueDto} from 'src/app/common/models';

export class ElementDto {
  id: number;
  label: string;
  status: string;
  reviewEnabled: boolean;
  approvalEnabled: boolean;
  extraFieldsEnabled: boolean;
  dataItemList: Array<DataItemDto> = [];
  elementList: Array<ElementDto> = [];
  extraComments: Array<FieldValueDto> = [];
  extraPictures: Array<FieldValueDto> = [];
  extraRecordings: Array<FieldValueDto> = [];
}
