import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {CommonDictionaryModel, OperationDataResult} from '../../../../common/models';
import {DashboardItemAnswerRequestModel, DashboardItemQuestionModel} from '../models';

const DictionariesMethods = {
  GetSurveys: 'api/insight-dashboard-pn/dictionary/surveys',
  GetLocationsBySurvey: 'api/insight-dashboard-pn/dictionary/locations-by-survey',
  GetQuestions: 'api/insight-dashboard-pn/dictionary/questions',
  GetFilterAnswers: 'api/insight-dashboard-pn/dictionary/filter-answers',
  GetTags: 'api/insight-dashboard-pn/dictionary/locations-tags'
};

@Injectable()
export class InsightDashboardPnDashboardDictionariesService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getQuestions(surveyId: number): Observable<OperationDataResult<Array<DashboardItemQuestionModel>>> {
    return this.get(DictionariesMethods.GetQuestions + '/' + surveyId);
  }

  getFilterAnswers(model: DashboardItemAnswerRequestModel): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.get(DictionariesMethods.GetFilterAnswers, model);
  }

  getSurveys(): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.get(DictionariesMethods.GetSurveys);
  }

  getTags(): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.get(DictionariesMethods.GetTags);
  }

  getLocationBySurveyId(surveyId?: number): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.get(DictionariesMethods.GetLocationsBySurvey + '/' + surveyId);
  }
}
