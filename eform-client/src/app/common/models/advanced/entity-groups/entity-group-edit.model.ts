import {EntityItemModel} from '../';

export class EntityGroupEditModel {
  name: string;
  entityItemModels: Array<EntityItemModel> = [];
  groupUid: number;
  isLocked: boolean;
  isEditable: boolean;
  description: string;
}
