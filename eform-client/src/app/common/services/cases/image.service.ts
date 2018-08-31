import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationResult} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

export let ImageMethods = {
  Rotate: '/api/template-files/rotate-image',
  Delete: '/api/template-files/delete-image',
};

@Injectable()
export class ImageService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  rotateImage(fileName: string): Observable<OperationResult> {
    return this.get(ImageMethods.Rotate + '?&fileName=' + fileName);
  }

  deleteImage(fileName, fieldId, uploadedObjId: number): Observable<OperationResult> {
    return this.get(ImageMethods.Delete
      + '?&fileName=' + fileName
      + '&fieldId=' + fieldId
      + '&uploadedObjId=' + uploadedObjId);
  }

}
