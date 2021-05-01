import { Injectable } from '@angular/core';
import { BaseService } from '../../../../common/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { OperationDataResult } from 'src/app/common/models';
import { AnswerModel } from '../models/answer';

const DashboardAnswersMethods = {
  Answers: 'api/insight-dashboard-pn/answers',
};

@Injectable()
export class InsightDashboardPnAnswersService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAnswer(
    microtingUUID: number
  ): Observable<OperationDataResult<AnswerModel>> {
    return this.get(DashboardAnswersMethods.Answers + '/' + microtingUUID);
  }

  deleteAnswer(microtingUUID: number): Observable<any> {
    return this.delete(DashboardAnswersMethods.Answers + '/' + microtingUUID);
  }
}
