import {DataItemDto} from './data-item.dto';
import {KeyValuePairDto} from './key-value-pair.dto';

export class FieldDto extends DataItemDto {
  id: number;
  label: string;
  description: string;
  fieldTypeId: number;
  fieldType: string;
  checkListId: number;
  parentName: string;
  keyValuePairList: KeyValuePairDto[] = [];
}
