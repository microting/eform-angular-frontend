import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/common/services/base.service';
import {
  OperationDataResult,
  OperationResult,
  EformDocxReportGenerateModel,
  EformDocxReportModel, EformDocxReportHeadersModel,
} from 'src/app/common/models';

export let EformDocxReportServiceMethods = {
  DocxReport: '/api/templates/docx-report',
  DocxReportHeaders: '/api/templates/docx-report/headers',
};

@Injectable()
export class EformDocxReportService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getTemplateDocxReportHeaders(templateId: number): Observable<
    OperationDataResult<EformDocxReportHeadersModel>
  > {
    return this.get(EformDocxReportServiceMethods.DocxReportHeaders + '/' + templateId);
  }

  updateTemplateDocxReportHeaders(
    model: EformDocxReportHeadersModel
  ): Observable<OperationResult> {
    return this.post(EformDocxReportServiceMethods.DocxReportHeaders, model);
  }

  generateReport(
    model: EformDocxReportGenerateModel
  ): Observable<OperationDataResult<EformDocxReportModel>> {
    return this.post(EformDocxReportServiceMethods.DocxReport, model);
  }

  downloadReport(model: EformDocxReportGenerateModel): Observable<any> {
    return this.getBlobData(
      EformDocxReportServiceMethods.DocxReport + '/word',
      model
    );
  }
}
