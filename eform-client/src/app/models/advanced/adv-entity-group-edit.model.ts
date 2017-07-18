import {AdvEntityItemModel} from 'app/models/advanced';
export class AdvEntityGroupEditModel {
  name: string;
  advEntityItemModels: Array<AdvEntityItemModel> = [];
  groupUid: string;
}
