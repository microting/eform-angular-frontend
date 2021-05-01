export class UploadedDatasModel {
  total: number;
  uploadedDatas: Array<UploadedDataModel> = [];
}

export class UploadedDataModel {
  id: number;
  itemCaseId: number;
  checkSum: string;
  extension: string;
  currentFile: string;
  uploaderType: string;
  fileLocation: string;
  fileName: string;
}
