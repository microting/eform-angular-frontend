import {ItemsListPnItemModel} from './items-list-pn-item.model';
import {Moment} from 'moment';

export class ItemsListPnCreateModel {
  name: string;
  description: string;
  repeatEvery: number;
  repeatType: number;
  dayOfWeek: number;
  dayOfMonth: number;
  repeatUntil: string;
  internalRepeatUntil: Moment | null;
  relatedEFormId: number;
  items: ItemsListPnItemModel[] = [];
}
