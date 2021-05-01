import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { FileUploader } from 'ng2-file-upload';
import { ProducerPnImportModel } from '../../../models/producer';
import { ProducerPnHeadersModel } from '../../../models/producer/producer-pn-headers.model';
import { TrashInspectionPnProducersService } from '../../../services';
import { FractionPnImportModel } from '../../../models/fraction';

const URL = '';

@Component({
  selector: 'app-producer-import',
  templateUrl: './producer-import.component.html',
  styleUrls: ['./producer-import.component.scss'],
})
export class ProducerImportComponent implements OnInit {
  public data: any = [];
  uploader: FileUploader;
  producerImportModel: ProducerPnImportModel;
  producerHeadersModel: ProducerPnHeadersModel;
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

  constructor(private producerService: TrashInspectionPnProducersService) {
    this.producerImportModel = new ProducerPnImportModel();
    this.options.forEach((option) => {
      this.producerHeadersModel = new ProducerPnHeadersModel();
      this.producerHeadersModel.headerLabel = option.label;
      this.producerHeadersModel.headerValue = null;
      this.producerImportModel.headerList.push(this.producerHeadersModel);
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
        this.producerImportModel.importList = JSON.stringify(this.tableData);
      },
    });
    return this.tableData;
  }

  importProducer() {
    // this.customerImportModel.importList = this.tableData;
    // debugger;
    this.producerImportModel.headers = JSON.stringify(
      this.producerImportModel.headerList
    );
    return this.producerService
      .importProducer(this.producerImportModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.producerImportModel = new FractionPnImportModel();
        }
      });
  }
  onSelectedChanged(e: any, columnIndex: any) {
    this.producerImportModel.headerList[e.value].headerValue = columnIndex;
  }
}
