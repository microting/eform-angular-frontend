import {AdvEntitySearchableItemModel} from './adv-entity-searchable-item.model';
export class AdvEntitySearchableGroupModel {
  name: string;
  type: string;
  microtingUUID: string;
  workflowState: string;
  status = true;
  createdAt: Date;
  updatedAt: Date;
  entityGroupItemLst: Array<AdvEntitySearchableItemModel> = [];
  isLocked: boolean;
  isEditable: boolean;
  description: string;
}
