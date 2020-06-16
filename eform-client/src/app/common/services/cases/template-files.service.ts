import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationResult} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

export let ImageMethods = {
  GetImage: '/api/template-files/get-image',
  RotateImage: '/api/template-files/rotate-image',
  DeleteImage: '/api/template-files/delete-image',
  GetPdf: '/api/template-files/get-pdf',
  GetPdfFile: '/api/template-files/get-pdf-file',
};

@Injectable()
export class TemplateFilesService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  rotateImage(fileName: string): Observable<OperationResult> {
    return this.get(ImageMethods.RotateImage + '?&fileName=' + fileName);
  }

  deleteImage(fileName, fieldId, uploadedObjId: number): Observable<OperationResult> {
    return this.get(ImageMethods.DeleteImage
      + '?&fileName=' + fileName
      + '&fieldId=' + fieldId
      + '&uploadedObjId=' + uploadedObjId);
  }

  getImage(fileName: string): Observable<any> {
    return this.getBlobData(`${ImageMethods.GetImage}/${fileName}`);
  }

  getPdf(fileName: string): Observable<any> {
    return this.getBlobData(`${ImageMethods.GetPdf}/${fileName}`);
  }

  getPdfFile(fileName: string): Observable<any> {
    return this.getBlobData(`${ImageMethods.GetPdfFile}?fileName=${fileName}`);
  }

}
