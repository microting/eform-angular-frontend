import {CaseModel} from 'app/models';

export class CaseListModel {
  numOfElements: number;
  pageNum: number;
  cases: Array<CaseModel> = [];

  constructor() {
    this.pageNum = 0;
    this.numOfElements = 0;
  }
}
