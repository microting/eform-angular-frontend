import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ProducerPnImportModel } from '../../../models/producer';
import { Papa } from 'ngx-papaparse';
import { TrashInspectionPnTransporterService } from '../../../services';
import { FractionPnImportModel } from '../../../models/fraction';
import {
  TransporterPnHeadersModel,
  TransporterPnImportModel,
} from '../../../models/transporter';

const URL = '';

@Component({
  selector: 'app-transporter-import',
  templateUrl: './transporter-import.component.html',
  styleUrls: ['./transporter-import.component.scss'],
})
export class TransporterImportComponent implements OnInit {
  public data: any = [];
  uploader: FileUploader;
  transporterImportModel: TransporterPnImportModel;
  transporterHeadersModel: TransporterPnHeadersModel;
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
    { value: 0, label: 'Name' },
    { value: 1, label: 'Description' },
    { value: 2, label: 'ForeignId' },
    { value: 3, label: 'Address' },
    { value: 4, label: 'City' },
    { value: 5, label: 'ZipCode' },
    { value: 6, label: 'Phone' },
    { value: 7, label: 'Contact Person' },
  ];

  constructor(private transporterService: TrashInspectionPnTransporterService) {
    this.transporterImportModel = new ProducerPnImportModel();
    this.options.forEach((option) => {
      this.transporterHeadersModel = new TransporterPnHeadersModel();
      this.transporterHeadersModel.headerLabel = option.label;
      this.transporterHeadersModel.headerValue = null;
      this.transporterImportModel.headerList.push(this.transporterHeadersModel);
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

  ngOnInit() {}

  csv2Array(fileInput) {
    const file = fileInput;
    this.papa.parse(fileInput.target.files[0], {
      skipEmptyLines: true,
      header: false,
      complete: (results) => {
        this.tableData = results.data;
        console.log(this.tableData);
        this.transporterImportModel.importList = JSON.stringify(this.tableData);
      },
    });
    return this.tableData;
  }

  importTransporter() {
    // this.customerImportModel.importList = this.tableData;
    // debugger;
    this.transporterImportModel.headers = JSON.stringify(
      this.transporterImportModel.headerList
    );
    return this.transporterService
      .importTransporter(this.transporterImportModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.transporterImportModel = new FractionPnImportModel();
        }
      });
  }
  onSelectedChanged(e: any, columnIndex: any) {
    this.transporterImportModel.headerList[e.value].headerValue = columnIndex;
  }
}
