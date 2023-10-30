import { Injectable } from '@angular/core';
import {Observable, zip} from 'rxjs';
import { EFormService } from 'src/app/common/services';
import {
    CommonPaginationState,
  FiltrationStateModel,
  OperationDataResult,
  TemplateListModel, TemplateRequestModel,
} from 'src/app/common/models';
import {arrayToggle} from '@datorama/akita';
import {updateTableSort} from 'src/app/common/helpers';
import {Store} from '@ngrx/store';
import {
  selectEformsFilters, selectEformsPagination,
  selectEformsTagIds
} from 'src/app/state/eform/eform.selector';

@Injectable({providedIn: 'root'})
export class EformsStateService {
  private selectEformsTagIds$ = this.store.select(selectEformsTagIds);
  private selectEformsPagination$ = this.store.select(selectEformsPagination);
  private selectEformsFilters$ = this.store.select(selectEformsFilters);

  constructor(
    private store: Store,
    private service: EFormService,
  ) {
  }

  updateNameFilter(nameFilter: string) {
    let currentFilters: FiltrationStateModel;
    this.selectEformsFilters$.subscribe((filters) => {
      if (filters === undefined) {
        return;
      }
      currentFilters = filters;
    }).unsubscribe();
    this.store.dispatch({
      type: '[Eform] Update Eform Filters', payload: {
        filters: {nameFilter: nameFilter, tagIds: currentFilters.tagIds}
      }
    });
  }

  onSortTable(sort: string) {
    let currentPagination: CommonPaginationState;
    this.selectEformsPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    const localPageSettings = updateTableSort(
      sort,
      currentPagination.sort,
      currentPagination.isSortDsc
    );
    this.store.dispatch({
      type: '[Eform] Update Eform Pagination', payload: {
        pagination: {sort: localPageSettings.sort, isSortDsc: localPageSettings.isSortDsc}
      }
    });
  }

  addOrRemoveTagIds(id: number) {
    let currentTagIds: number[];
    this.selectEformsTagIds$.subscribe((tagIds) => {
      if (tagIds === undefined) {
        return;
      }
      currentTagIds = tagIds;
    }).unsubscribe();
    this.store.dispatch({
      type: '[Eform] Update Eform Filters', payload: {
        filters: {tagIds: arrayToggle(currentTagIds, id)}
      }
    });
  }

  updateTagIds(tagIds: number[]) {
    let currentFilters: FiltrationStateModel;
    this.selectEformsFilters$.subscribe((filters) => {
      if (filters === undefined) {
        return;
      }
      currentFilters = filters;
    }).unsubscribe();
    this.store.dispatch({type: '[Eform] Update Eform Filters', payload: {
        filters: {tagIds: tagIds, nameFilter: currentFilters.nameFilter}}});
  }

  loadAllTemplates(): Observable<OperationDataResult<TemplateListModel>> {
    let templateRequestModel = new TemplateRequestModel();
    zip(this.selectEformsPagination$, this.selectEformsFilters$).subscribe(([pagination, filters]) => {
      if (pagination === undefined || filters === undefined) {
        return;
      }
      templateRequestModel = {
        nameFilter: filters.nameFilter,
        tagIds: filters.tagIds,
        sort: pagination.sort,
        isSortDsc: pagination.isSortDsc,
        offset: 0,
        pageIndex: 0,
        pageSize: 100000,
      }
    });
    return this.service.getAll(templateRequestModel);
  }
}
