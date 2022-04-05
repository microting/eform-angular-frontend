import { AdvEntitySearchableItemModel } from 'src/app/common/models';

export class AdvEntitySearchableGroupEditModel {
  name: string;
  advEntitySearchableItemModels: Array<AdvEntitySearchableItemModel> = [];
  groupUid: number;
  isLocked: boolean;
  isEditable: boolean;
  description: string;
}
