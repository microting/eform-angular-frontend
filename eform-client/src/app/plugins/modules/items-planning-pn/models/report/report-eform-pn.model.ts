import {ReportEformItemModel} from './report-eform-item-pn.model';
import {ReportEformPostModel} from './report-eform-post-pn.model';

export class ReportEformPnModel {
  templateName: string;

  textHeaders: ReportEformTextHeaderModel;
  descriptionBlocks: string[];
  tableName: string;

  items: ReportEformItemModel[] = [];
  itemHeaders: {key: string, value: string}[] = [];
  imageNames: {key: {key: number, value: string}, value: {key: string, value: string}}[] = [];
  posts: ReportEformPostModel[] = [];
}

export class ReportEformTextHeaderModel {
  header1: string;
  header2: string;
  header3: string;
  header4: string;
  header5: string;
}
