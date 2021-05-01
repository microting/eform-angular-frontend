import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult} from '../../../../common/models';
import {ItemListPnCaseResultListModel} from '../models/list';
import {ItemsListCasePnModel, ItemsListPnItemCaseModel} from '../models/list/items-list-case-pn.model';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {ItemListCasesPnRequestModel} from '../models/list/item-list-cases-pn-request.model';

export let ItemsGroupPlanningPnCasesMethods = {
  Cases: 'api/items-group-planning-pn/list-cases',
  CaseResults: 'api/items-group-planning-pn/list-case-results'
};
@Injectable({
  providedIn: 'root'
})

export class ItemsGroupPlanningPnCasesService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllCases(model: ItemListCasesPnRequestModel): Observable<OperationDataResult<ItemsListCasePnModel>> {
    return this.get(ItemsGroupPlanningPnCasesMethods.Cases, model);
  }

  getAllCaseResults(model: ItemListCasesPnRequestModel): Observable<OperationDataResult<ItemListPnCaseResultListModel>> {
    return this.get(ItemsGroupPlanningPnCasesMethods.CaseResults, model);
  }

  getSingleCase(caseId: number): Observable<OperationDataResult<ItemsListPnItemCaseModel>> {
    return this.get(ItemsGroupPlanningPnCasesMethods.Cases + '/:id/' + caseId);
  }

  getGeneratedReport(model: ItemListCasesPnRequestModel): Observable<any> {
    return this.getBlobData(ItemsGroupPlanningPnCasesMethods.CaseResults + '/excel', model);
  }
}
