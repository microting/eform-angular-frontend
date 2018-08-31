import {AdvEntitySelectableGroupModel} from './adv-entity-selectable-group.model';
export class AdvEntitySelectableGroupListModel {
  numOfElements: number;
  pageNum: number;
  entityGroups: Array<AdvEntitySelectableGroupModel> = [];

  constructor() {
    this.pageNum = 0;
    this.numOfElements = 0;
  }
}
