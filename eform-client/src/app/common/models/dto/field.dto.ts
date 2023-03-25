import {DataItemDto, Description} from './data-item.dto';
import {KeyValuePairDto} from './key-value-pair.dto';

export class FieldDto extends DataItemDto {
  declare id: number;
  declare label: string;
  declare description: Description;
  fieldTypeId: number;
  declare fieldType: string;
  checkListId: number;
  parentName: string;
  keyValuePairList: KeyValuePairDto[] = [];
}
