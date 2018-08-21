import {AdvEntitySearchableGroupModel} from './adv-entity-searchable-group.model';
export class AdvEntitySearchableGroupListModel {
  numOfElements: number;
  pageNum: number;
  entityGroups: Array<AdvEntitySearchableGroupModel> = [];

  constructor() {
    this.pageNum = 0;
    this.numOfElements = 0;
  }
}
