import {BaseDataItem} from './base-data-item.model';
import {KeyValuePairDto} from '../../../../../common/models/dto';

export class SelectBlock extends BaseDataItem {
  keyValuePairList: KeyValuePairDto[];
}
