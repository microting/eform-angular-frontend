import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {CommonDictionaryModel, OperationDataResult, OperationResult} from '../../../../common/models';
import {SurveyConfigCreateModel, SurveyConfigUpdateModel, SurveyConfigsListModel, SurveyConfigUpdateStatusModel} from '../models';
import {SurveyConfigsRequestModel} from '../models/survey/survey-configs-request.model';

export let SurveyConfigsMethods = {
  Get: 'api/insight-dashboard-pn/survey-configs',
  GetSurveys: 'api/insight-dashboard-pn/survey-configs/surveys',
  Create: 'api/insight-dashboard-pn/survey-configs/create',
  Update: 'api/insight-dashboard-pn/survey-configs/update',
  Status: 'api/insight-dashboard-pn/survey-configs/status',
  Delete: 'api/insight-dashboard-pn/survey-configs/delete'
};
@Injectable()
export class InsightDashboardPnSurveyConfigsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAll(model: SurveyConfigsRequestModel): Observable<OperationDataResult<SurveyConfigsListModel>> {
    return this.post(SurveyConfigsMethods.Get, model);
  }

  changeStatus(model: SurveyConfigUpdateStatusModel): Observable<OperationResult> {
    return this.post(SurveyConfigsMethods.Status, model);
  }

  create(model: SurveyConfigCreateModel): Observable<OperationResult> {
    return this.post(SurveyConfigsMethods.Create, model);
  }

  update(model: SurveyConfigUpdateModel): Observable<OperationResult> {
    return this.post(SurveyConfigsMethods.Update, model);
  }

  remove(id: number): Observable<OperationResult> {
    return this.post(SurveyConfigsMethods.Delete + '?id=' + id, {});
  }
}
