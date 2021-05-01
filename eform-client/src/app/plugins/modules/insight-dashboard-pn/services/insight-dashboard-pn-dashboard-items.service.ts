import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {DashboardItemExportRequestModel} from '../models';
import {OperationDataResult} from 'src/app/common/models';
import {DashboardViewItemModel} from '../models/dashboard/dashboard-view/dashboard-view-item.model';
import {DashboardItemPreviewRequestModel} from '../models/dashboard/dashboard-item/dashboard-item-preview-request.model';

const DashboardItemMethods = {
  ExportInterviews: 'api/insight-dashboard-pn/dashboard-items/export-interviews',
  Preview: 'api/insight-dashboard-pn/dashboard-items/preview',
};
@Injectable()
export class InsightDashboardPnDashboardItemsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getItemPreview(model: DashboardItemPreviewRequestModel): Observable<OperationDataResult<DashboardViewItemModel>> {
    return this.post(DashboardItemMethods.Preview, model);
  }

  exportInterviewsToExcel(model: DashboardItemExportRequestModel): Observable<any> {
    return this.getBlobData(DashboardItemMethods.ExportInterviews, model);
  }
}
