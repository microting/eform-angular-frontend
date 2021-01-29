import {EformDocxReportItemModel} from './eform-docx-report-item.model';

export class EformDocxReportModel {
  templateName: string;

  textHeaders: EformDocxReportTextHeaderModel;
  descriptionBlocks: string[];

  items: EformDocxReportItemModel[] = [];
  itemHeaders: {key: string, value: string}[] = [];
  imageNames: {key: {key: number, value: string}, value: {key: string, value: string}}[] = [];
}

export class EformDocxReportTextHeaderModel {
  header1: string;
  header2: string;
  header3: string;
  header4: string;
  header5: string;
}
