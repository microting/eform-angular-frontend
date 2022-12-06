import {EntityItemModel} from '../';
export class EntityGroupModel {
  name: string;
  type: string;
  microtingUUID: string;
  workflowState: string;
  status = true;
  createdAt: Date;
  updatedAt: Date;
  entityGroupItemLst: Array<EntityItemModel> = [];
  isLocked: boolean;
  isEditable: boolean;
  description: string;
}
