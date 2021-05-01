import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult} from '../../../../common/models';
import {PlanningCaseResultListModel} from '../models/plannings';
import {PlanningCasesModel, PlanningCaseModel} from '../models/plannings/planning-cases/planning-cases.model';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {PlanningCasesRequestModel} from '../models/plannings/planning-cases/planning-cases-request.model';

export let ItemsPlanningPnCasesMethods = {
  Cases: 'api/items-planning-pn/plannings-cases',
  CaseResults: 'api/items-planning-pn/plannings-case-results'
};
@Injectable({
  providedIn: 'root'
})

export class ItemsPlanningPnCasesService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllCases(model: PlanningCasesRequestModel): Observable<OperationDataResult<PlanningCasesModel>> {
    return this.get(ItemsPlanningPnCasesMethods.Cases, model);
  }

  getAllCaseResults(model: PlanningCasesRequestModel): Observable<OperationDataResult<PlanningCaseResultListModel>> {
    return this.get(ItemsPlanningPnCasesMethods.CaseResults, model);
  }

  getSingleCase(caseId: number): Observable<OperationDataResult<PlanningCaseModel>> {
    return this.get(ItemsPlanningPnCasesMethods.Cases + '/:id/' + caseId);
  }

  getGeneratedReport(model: PlanningCasesRequestModel): Observable<any> {
    return this.getBlobData(ItemsPlanningPnCasesMethods.CaseResults + '/excel', model);
  }
}
