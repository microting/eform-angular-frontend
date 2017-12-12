import {TemplateDto} from 'app/models/dto';

export class TemplateListModel {
  numOfElements: number;
  pageNum: number;
  templates: Array<TemplateDto> = [];

  constructor() {
    this.pageNum = 0;
    this.numOfElements = 0;
  }
}
