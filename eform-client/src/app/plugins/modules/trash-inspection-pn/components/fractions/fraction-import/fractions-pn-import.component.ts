import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Papa } from 'ngx-papaparse';
import { TrashInspectionPnFractionsService } from '../../../services';
import { FractionPnImportModel } from '../../../models/fraction';
import { FractionPnHeadersModel } from '../../../models/fraction/fraction-pn-headers.model';

const URL = '';
@Component({
  selector: 'app-trash-inspection-pn-fraction-import',
  templateUrl: './fractions-pn-import.component.html',
  styleUrls: ['./fractions-pn-import.component.scss'],
})
export class FractionsPnImportComponent implements OnInit {
  public data: any = [];
  uploader: FileUploader;
  fractionsImportModel: FractionPnImportModel;
  fractionHeaderModel: FractionPnHeadersModel;
  fileName: string;
  totalColumns: number;
  totalRows: number;
  myFile: any;
  chboxNames = [
    'Exclude the first row',
    'Ignore all unselected fields',
    'Manage matching records',
  ];
  papa: Papa = new Papa();
  tableData: any = null;
  options = [
    { value: 0, label: 'Number' },
    { value: 1, label: 'Name' },
    { value: 2, label: 'Location Nr' },
    { value: 3, label: 'eForm nr' },
    { value: 4, label: 'Statutory eForm' },
    { value: 5, label: 'Description' },
  ];
  constructor(private fractionsService: TrashInspectionPnFractionsService) {
    this.fractionsImportModel = new FractionPnImportModel();
    // forEach(Option in this.options) {
    //   this.customerHeaderModel = new CustomerPnHeadersModel();
    //   this.customerHeaderModel.header = str.label;
    //   this.customerImportModel.headers.add this.customerHeaderModel;
    // }
    // this.customerHeaderModel = new CustomerPnHeadersModel();
    this.options.forEach((option) => {
      this.fractionHeaderModel = new FractionPnHeadersModel();
      this.fractionHeaderModel.headerLabel = option.label;
      this.fractionHeaderModel.headerValue = null;
      this.fractionsImportModel.headerList.push(this.fractionHeaderModel);
      // console.log(label);
    });
    this.uploader = new FileUploader({
      url: URL,
      autoUpload: true,
      isHTML5: true,
      removeAfterUpload: true,
    });
    this.uploader.onAfterAddingFile = (fileItem) => {
      fileItem.withCredentials = false;
      // console.log(fileItem._file);
      this.myFile = fileItem.file.rawFile;
    };
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
        this.fractionsImportModel.importList = JSON.stringify(this.tableData);
      },
    });
    return this.tableData;
  }
  importFraction() {
    // this.customerImportModel.importList = this.tableData;
    // debugger;
    this.fractionsImportModel.headers = JSON.stringify(
      this.fractionsImportModel.headerList
    );
    return this.fractionsService
      .importFraction(this.fractionsImportModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.fractionsImportModel = new FractionPnImportModel();
        }
      });
  }
  logThings(value) {
    console.log(value);
  }
  onSelectedChanged(e: any, columnIndex: any) {
    this.fractionsImportModel.headerList[e.value].headerValue = columnIndex;
  }
}
