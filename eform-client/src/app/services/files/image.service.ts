import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Router} from '@angular/router';
import {ImageMethods} from 'app/modules/helpers/app.constants';
import {OperationResult} from 'app/modules/helpers/operation.models';
import {BaseService} from 'app/services/base.service';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ImageService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  rotateImage(fileName: string): Observable<OperationResult> {
    return this.getWithOperationResult(ImageMethods.Rotate + '?&fileName=' + fileName);
  }

  deleteImage(fileName, fieldId, uploadedObjId: number): Observable<OperationResult> {
    return this.getWithOperationResult(ImageMethods.Delete
      + '?&fileName=' + fileName
      + '&fieldId=' + fieldId
      + '&uploadedObjId=' + uploadedObjId);
  }

}
