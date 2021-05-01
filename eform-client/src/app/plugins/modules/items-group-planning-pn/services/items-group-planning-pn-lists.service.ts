import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import { Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult, OperationResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';

import {
  ItemsListPnModel,
  ItemsListsPnModel,
  ItemsListPnUpdateModel,
  ItemsListPnRequestModel, ItemsListPnCreateModel, ItemsGroupPlanningPnUnitImportModel
} from '../models/list';

export let ItemsGroupPlanningPnListsMethods = {
  Lists: 'api/items-group-planning-pn/lists',
};
@Injectable({
  providedIn: 'root'
})
export class ItemsGroupPlanningPnListsService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllLists(model: ItemsListPnRequestModel): Observable<OperationDataResult<ItemsListsPnModel>> {
    return this.get(ItemsGroupPlanningPnListsMethods.Lists, model);
  }

  getSingleList(listId: number): Observable<OperationDataResult<ItemsListPnModel>> {
    return this.get(ItemsGroupPlanningPnListsMethods.Lists + '/' + listId);
  }

  updateList(model: ItemsListPnUpdateModel): Observable<OperationResult> {
    return this.put(ItemsGroupPlanningPnListsMethods.Lists, model);
  }

  createList(model: ItemsListPnCreateModel): Observable<OperationResult> {
    return this.post(ItemsGroupPlanningPnListsMethods.Lists, model);
  }

  deleteList(fractionId: number): Observable<OperationResult> {
    return this.delete(ItemsGroupPlanningPnListsMethods.Lists + '/' + fractionId);
  }

  importUnit(model: ItemsGroupPlanningPnUnitImportModel): Observable<OperationResult> {
    return this.post(ItemsGroupPlanningPnListsMethods.Lists + '/import', model);
  }
}
