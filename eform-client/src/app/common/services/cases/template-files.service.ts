import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationResult } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

export let ImageMethods = {
  GetImage: '/api/template-files/get-image',
  RotateImage: '/api/template-files/rotate-image',
  DeleteImage: '/api/template-files/delete-image',
  GetPdf: '/api/template-files/get-pdf',
  GetPdfFile: '/api/template-files/get-pdf-file',
};

@Injectable()
export class TemplateFilesService {
  constructor(private apiBaseService: ApiBaseService) {}

  rotateImage(fileName: string): Observable<OperationResult> {
    return this.apiBaseService.get(
      ImageMethods.RotateImage + '?&fileName=' + fileName
    );
  }

  deleteImage(
    fileName,
    fieldId,
    uploadedObjId: number
  ): Observable<OperationResult> {
    return this.apiBaseService.get(
      ImageMethods.DeleteImage +
        '?&fileName=' +
        fileName +
        '&fieldId=' +
        fieldId +
        '&uploadedObjId=' +
        uploadedObjId
    );
  }

  getImage(fileName: string): Observable<any> {
    return this.apiBaseService.getBlobData(
      `${ImageMethods.GetImage}/${fileName}`
    );
  }

  getPdf(fileName: string): Observable<any> {
    return this.apiBaseService.getBlobData(
      `${ImageMethods.GetPdf}/${fileName}`
    );
  }

  getPdfFile(fileName: string): Observable<any> {
    return this.apiBaseService.getBlobData(
      `${ImageMethods.GetPdfFile}?fileName=${fileName}`
    );
  }
}
