import { FractionPnHeadersModel } from './fraction-pn-headers.model';

export class FractionPnImportModel {
  importList: string;
  headerList: Array<FractionPnHeadersModel> = [];
  headers: string;
}
