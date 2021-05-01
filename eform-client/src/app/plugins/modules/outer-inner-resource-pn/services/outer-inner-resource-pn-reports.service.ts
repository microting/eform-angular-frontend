import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';
import {ReportPnFullModel, ReportPnGenerateModel} from '../models';
import {ReportNamesModel} from '../models/report/report-names.model';

export let OuterInnerResourcePnReportsMethods = {
  Reports: 'api/outer-inner-resource-pn/reports',
};

@Injectable()
export class OuterInnerResourcePnReportsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  generateReport(model: ReportPnGenerateModel): Observable<OperationDataResult<ReportPnFullModel>> {
    return this.get(OuterInnerResourcePnReportsMethods.Reports, model);
  }

  getReportNames(): Observable<OperationDataResult<ReportNamesModel>> {
    return this.get(OuterInnerResourcePnReportsMethods.Reports + '/reportnames');
  }

  getGeneratedReport(model: ReportPnGenerateModel): Observable<any> {
    return this.getBlobData(OuterInnerResourcePnReportsMethods.Reports + '/excel', model);
  }

}
