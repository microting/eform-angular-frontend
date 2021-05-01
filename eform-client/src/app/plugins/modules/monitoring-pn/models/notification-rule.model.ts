import {RecipientModel} from './recipient.model';
import {NotificationRuleType} from '../const';
import {BaseDataItem} from './blocks';
import {DeviceUserModel} from './device-user.model';

export class NotificationRuleModel {
  id?: number;
  checkListId: number;
  subject: string;
  text: string;
  attachReport: boolean;
  attachLink: boolean;
  includeValue: boolean;
  ruleType: NotificationRuleType;
  dataItemId: number;
  data?: BaseDataItem;
  recipients: RecipientModel[];
  deviceUsers: DeviceUserModel[];
}
