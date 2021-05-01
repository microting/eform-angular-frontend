import { TransporterPnHeadersModel } from './transporter-pn-headers.model';

export class TransporterPnImportModel {
  importList: string;
  headerList: Array<TransporterPnHeadersModel> = [];
  headers: string;
}
