import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {UploadedDatasModel} from '../models/list';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {Injectable} from '@angular/core';


export let ItemsGroupPlanningPnUploadedDataMethods = {
  UploadedDatas: 'api/items-group-planning-pn/uploaded-data',
  DownloadPDF: 'api/items-group-planning-pn/uploaded-data/download-pdf/'
};
@Injectable({
  providedIn: 'root'
})
export class ItemsGroupPlanningPnUploadedDataService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllUploadedData(itemCaseId: number): Observable<OperationDataResult<UploadedDatasModel>> {
    return this.get(ItemsGroupPlanningPnUploadedDataMethods.UploadedDatas + '/get-all/' + itemCaseId);
  }

  deleteUploadedData(uploadedDataId: number): Observable<OperationResult> {
    return this.delete(ItemsGroupPlanningPnUploadedDataMethods.UploadedDatas + '/' + uploadedDataId);
  }

  downloadUploadedDataPdf(fileName: string): Observable<OperationResult> {
    return this.get(ItemsGroupPlanningPnUploadedDataMethods.DownloadPDF, fileName);
  }
}
