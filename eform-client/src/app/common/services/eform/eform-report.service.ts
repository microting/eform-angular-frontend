import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EformFullReportModel,
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const TemplateReportMethods = {
  Report: '/api/templates/',
  UpdateReport: '/api/templates/report',
};

@Injectable()
export class EformReportService {
  private apiBaseService = inject(ApiBaseService);


  getSingle(
    templateId: number
  ): Observable<OperationDataResult<EformFullReportModel>> {
    return this.apiBaseService.get(
      TemplateReportMethods.Report + templateId + '/report'
    );
  }

  updateSingle(model: EformFullReportModel): Observable<OperationResult> {
    return this.apiBaseService.put(TemplateReportMethods.UpdateReport, model);
  }
}
