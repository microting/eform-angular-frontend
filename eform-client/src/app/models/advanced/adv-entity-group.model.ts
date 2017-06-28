import {AdvEntityItemModel} from 'app/models/advanced/adv-entity-item.model';
export class AdvEntityGroupModel {
  name: string;
  type: string;
  entityGroupMUId: string;
  workflowState: string;
  status = true;
  createdAt: Date;
  updatedAt: Date;
  entityGroupItemLst: Array<AdvEntityItemModel> = [];
}
