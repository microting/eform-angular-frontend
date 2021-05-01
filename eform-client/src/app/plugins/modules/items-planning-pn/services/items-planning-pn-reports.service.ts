import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';
import {ReportEformPnModel, ReportPnGenerateModel} from '../models/report';

export let ItemsPlanningPnReportsMethods = {
  Reports: 'api/items-planning-pn/reports',
};

@Injectable()
export class ItemsPlanningPnReportsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  generateReport(model: ReportPnGenerateModel): Observable<OperationDataResult<ReportEformPnModel[]>> {
    return this.post(ItemsPlanningPnReportsMethods.Reports, model);
  }

  downloadReport(model: ReportPnGenerateModel): Observable<any> {
    return this.getBlobData(ItemsPlanningPnReportsMethods.Reports + '/word', model);
  }

}
