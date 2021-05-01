import {Component, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {Papa} from 'ngx-papaparse';
import { CustomersPnService} from '../../services';
import {CustomersPnImportModel, CustomerPnHeadersModel} from '../../models/customer';

const URL = '';
@Component({
  selector: 'app-customer-pn-import',
  templateUrl: './customer-pn-import.component.html',
  styleUrls: ['./customer-pn-import.component.scss']
})
export class CustomerPnImportComponent implements OnInit {
  public data: any = [];
  uploader: FileUploader;
  customerImportModel: CustomersPnImportModel;
  customerHeaderModel: CustomerPnHeadersModel;
  fileName: string;
  totalColumns: number;
  totalRows: number;
  myFile: any;
  chboxNames = ['Exclude the first row', 'Ignore all unselected fields', 'Manage matching records'];
  papa: Papa = new Papa();
  tableData: any = null;
  options = [
    {value: 0, label: 'CityName'},
    {value: 1, label: 'CompanyAddress'},
    {value: 2, label: 'CompanyAddress2'},
    {value: 3, label: 'CompanyName'},
    {value: 4, label: 'ContactPerson'},
    {value: 5, label: 'CustomerNo'},
    {value: 6, label: 'Description'},
    {value: 7, label: 'E-mail'},
    {value: 8, label: 'Phone'},
    {value: 9, label: 'ZipCode'},
    {value: 10, label: 'EanCode'},
    {value: 11, label: 'VatNumber'},
    {value: 12, label: 'CountryCode'},
    {value: 13, label: 'CrmId'},
    {value: 14, label: 'CadastralNumber'},
    {value: 15, label: 'PropertyNumber'},
    {value: 16, label: 'ApartmentNumber'},
    {value: 17, label: 'CompletionYear'},
    {value: 18, label: 'FloorsWithLivingSpace'},
    {value: 19, label: 'Ignore'}
  ];
  constructor(private customerService: CustomersPnService) {
    this.customerImportModel = new CustomersPnImportModel();
    // forEach(Option in this.options) {
    //   this.customerHeaderModel = new CustomerPnHeadersModel();
    //   this.customerHeaderModel.header = str.label;
    //   this.customerImportModel.headers.add this.customerHeaderModel;
    // }
    // this.customerHeaderModel = new CustomerPnHeadersModel();
   this.options.forEach((option) => {
     this.customerHeaderModel = new CustomerPnHeadersModel();
      this.customerHeaderModel.headerLabel = option.label;
      this.customerHeaderModel.headerValue = null;
      this.customerImportModel.headerlist.push(this.customerHeaderModel);
      // console.log(label);
   }
  );
    this.uploader = new FileUploader(
      {
        url: URL,
        autoUpload: true,
        isHTML5: true,
        removeAfterUpload: true
      });
    this.uploader.onAfterAddingFile = (fileItem => {
      fileItem.withCredentials = false;
      // console.log(fileItem._file);
      this.myFile = fileItem.file.rawFile;
    });
  }



  ngOnInit() {
    this.fileName = 'DummyCustomerData.csv';
    this.totalColumns = 4;
    this.totalRows = 100;
  }
  csv2Array(fileInput) {
    const file = fileInput;
    this.papa.parse(fileInput.target.files[0], {
      skipEmptyLines: true,
      header: false,
      complete: (results) => {
        this.tableData = results.data;
        console.log(this.tableData);
        this.customerImportModel.importList = JSON.stringify(this.tableData);
      }
    });
    return this.tableData;
  }
    importCustomer() {
    // this.customerImportModel.importList = this.tableData;
    // debugger;
    this.customerImportModel.headers = JSON.stringify(this.customerImportModel.headerlist);
    return this.customerService.importCustomer(this.customerImportModel).subscribe(((data) => {
      if (data && data.success) {
        this.customerImportModel = new CustomersPnImportModel();
      }
    }));
  }
  logThings(value) {
    console.log(value);
  }
  onSelectedChanged(e: any, columnIndex: any) {
    this.customerImportModel.headerlist[e.value].headerValue = columnIndex;
  }
}
