import {AdvEntitySelectableItemModel} from './adv-entity-selectable-item.model';
export class AdvEntitySelectableGroupModel {
  name: string;
  type: string;
  microtingUUID: string;
  workflowState: string;
  status = true;
  createdAt: Date;
  updatedAt: Date;
  entityGroupItemLst: Array<AdvEntitySelectableItemModel> = [];
}
