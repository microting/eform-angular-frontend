import {AdvEntitySelectableItemModel} from './adv-entity-selectable-item.model';
export class AdvEntitySelectableGroupEditModel {
  name: string;
  advEntitySelectableItemModels: Array<AdvEntitySelectableItemModel> = [];
  groupUid: number;
  isLocked: boolean;
  isEditable: boolean;
  description: string;
}
