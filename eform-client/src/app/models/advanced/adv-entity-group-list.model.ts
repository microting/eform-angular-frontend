import {AdvEntityGroupModel} from 'app/models/advanced';
export class AdvEntityGroupListModel {
  numOfElements: number;
  pageNum: number;
  entityGroups: Array<AdvEntityGroupModel> = [];

  constructor() {
    this.pageNum = 0;
    this.numOfElements = 0;
  }
}
