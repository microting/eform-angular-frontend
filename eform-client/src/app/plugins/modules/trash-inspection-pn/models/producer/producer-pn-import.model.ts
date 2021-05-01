import { ProducerPnHeadersModel } from './producer-pn-headers.model';

export class ProducerPnImportModel {
  importList: string;
  headerList: Array<ProducerPnHeadersModel> = [];
  headers: string;
}
