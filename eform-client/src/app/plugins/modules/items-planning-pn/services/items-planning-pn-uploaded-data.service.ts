import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {UploadedDatasModel} from '../models/plannings';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {Injectable} from '@angular/core';


export let ItemsPlanningPnUploadedDataMethods = {
  UploadedDatas: 'api/items-planning-pn/uploaded-data',
  DownloadPDF: 'api/items-planning-pn/uploaded-data/download-pdf/'
};
@Injectable({
  providedIn: 'root'
})
export class ItemsPlanningPnUploadedDataService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllUploadedData(itemCaseId: number): Observable<OperationDataResult<UploadedDatasModel>> {
    return this.get(ItemsPlanningPnUploadedDataMethods.UploadedDatas + '/get-all/' + itemCaseId);
  }

  deleteUploadedData(uploadedDataId: number): Observable<OperationResult> {
    return this.delete(ItemsPlanningPnUploadedDataMethods.UploadedDatas + '/' + uploadedDataId);
  }

  downloadUploadedDataPdf(fileName: string): Observable<OperationResult> {
    return this.get(ItemsPlanningPnUploadedDataMethods.DownloadPDF, fileName);
  }
}
