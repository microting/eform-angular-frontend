import {AdvEntityItemModel} from './adv-entity-item.model';
export class AdvEntityGroupEditModel {
  name: string;
  advEntityItemModels: Array<AdvEntityItemModel> = [];
  groupUid: string;
}
