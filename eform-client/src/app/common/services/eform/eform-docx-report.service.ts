import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';
import {EformDocxReportGenerateModel, EformDocxReportModel} from 'src/app/common/models';

export let EformDocxReportServiceMethods = {
  DocxReport: '/api/templates/docx-report'
};

@Injectable()
export class EformDocxReportService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  generateReport(model: EformDocxReportGenerateModel): Observable<OperationDataResult<EformDocxReportModel>> {
    return this.post(EformDocxReportServiceMethods.DocxReport, model);
  }

  downloadReport(model: EformDocxReportGenerateModel): Observable<any> {
    return this.getBlobData(EformDocxReportServiceMethods.DocxReport + '/word', model);
  }

}
