import {CustomerPnHeadersModel} from './customer-pn-headers.model';

export class CustomersPnImportModel {
  importList: string;
  headerlist: Array<CustomerPnHeadersModel> = [];
  headers: string;
}
