import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {OperationDataResult, OperationResult} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

export let ImageMethods = {
  Image: '/api/template-files/image',
  GetImage: '/api/template-files/get-image',
  RotateImage: '/api/template-files/rotate-image',
  DeleteImage: '/api/template-files/delete-image',
  GetPdf: '/api/template-files/get-pdf',
  GetPdfFile: '/api/template-files/get-pdf-file',
};

@Injectable()
export class TemplateFilesService {
  private apiBaseService = inject(ApiBaseService);


  rotateImage(fileName: string): Observable<OperationResult> {
    return this.apiBaseService.get(
      ImageMethods.RotateImage, {fileName}
    );
  }

  deleteImage(
    fileName,
    fieldId,
    uploadedObjId: number
  ): Observable<OperationResult> {
    return this.apiBaseService.get(
      ImageMethods.DeleteImage, {fileName, fieldId, uploadedObjId}
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
      ImageMethods.GetPdfFile, {fileName}
    );
  }

  updateImage(uploadedObjId: number, file: File): Observable<OperationResult> {
    const formData = ApiBaseService.objectToFormData({uploadedObjId, file}, true);
    return this.apiBaseService.putFormData(
      ImageMethods.Image, formData
    );
  }

  addNewImage(fieldId: number, caseId: number, file: File): Observable<OperationResult> {
    return this.apiBaseService.postFormData(
      ImageMethods.Image, {fieldId, caseId, file}
    );
  }
}
