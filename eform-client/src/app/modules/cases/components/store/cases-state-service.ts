import { Injectable } from '@angular/core';
import { CasesService, EFormService } from 'src/app/common/services';
import {Observable, zip} from 'rxjs';
import {
  CaseListModel, CasesRequestModel, CommonPaginationState, FiltrationStateModel,
  OperationDataResult,
  PaginationModel,
  TemplateDto,
} from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { map } from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {selectCasesFilters, selectCasesPagination, selectCasesTagIds} from 'src/app/state/cases/cases.selector';

@Injectable({ providedIn: 'root' })
export class CasesStateService {
  private selectCasesPagination$ = this.store.select(selectCasesPagination);
  private selectCasesFilters$ = this.store.select(selectCasesFilters);
  constructor(
    private store: Store,
    private service: CasesService,
    private eFormService: EFormService
  ) {}

  private templateId: number;

  loadTemplateData(): Observable<OperationDataResult<TemplateDto>> {
    return this.eFormService.getSingle(this.templateId);
  }

  getCases(): Observable<OperationDataResult<CaseListModel>> {
    let casesRequestModel = new CasesRequestModel();
    zip(this.selectCasesPagination$, this.selectCasesFilters$).subscribe(([pagination, filters]) => {
      if (pagination === undefined || filters === undefined) {
        return;
      }
      casesRequestModel = {
        sort: pagination.sort,
        isSortDsc: pagination.isSortDsc,
        offset: pagination.offset,
        pageSize: pagination.pageSize,
        nameFilter: filters.nameFilter,
        templateId: this.templateId,
      };
    }).unsubscribe();
    return this.service.getCases(casesRequestModel).pipe(
      map((response) => {
        if (response && response.success && response.model) {
          this.store.dispatch({
            type: '[Cases] Update Cases Pagination', payload: {
              pagination: {
                sort: casesRequestModel.sort,
                isSortDsc: casesRequestModel.isSortDsc,
                offset: casesRequestModel.offset,
                pageSize: casesRequestModel.pageSize,
                nameFilter: casesRequestModel.nameFilter,
                templateId: casesRequestModel.templateId,
                total: response.model.numOfElements,
              }
            }
          });
        }
        return response;
      })
    );
  }

  setTemplateId(templateId: number) {
    this.templateId = templateId;
  }

  updateNameFilter(nameFilter: string) {
    let currentFilters: FiltrationStateModel;
    this.selectCasesFilters$.subscribe((filters) => {
      if (filters === undefined) {
        return;
      }
      currentFilters = filters;
    }).unsubscribe();
    this.store.dispatch({
      type: '[Cases] Update Cases Filters', payload: {
        filters: {nameFilter: nameFilter, tagIds: currentFilters.tagIds}
      }
    });
  }


  onDelete() {
    let currentPagination: CommonPaginationState;
    this.selectCasesPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({
      type: '[Cases] Update Cases Pagination', payload: {
        pagination: {offset: currentPagination.offset - 1}
      }
    });
  }

  onSortTable(sort: string) {
    let currentPagination: CommonPaginationState;
    this.selectCasesPagination$.subscribe((pagination) => {
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
      type: '[Cases] Update Cases Pagination', payload: {
        pagination: {sort: localPageSettings.sort, isSortDsc: localPageSettings.isSortDsc}
      }
    });
  }

  updatePagination(pagination: PaginationModel) {
    let currentPagination: CommonPaginationState;
    this.selectCasesPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({
      type: '[Cases] Update Cases Pagination', payload: {
        pagination: {
          sort: currentPagination.sort,
          isSortDsc: currentPagination.isSortDsc,
          offset: pagination.offset,
          pageIndex: currentPagination.pageIndex,
          pageSize: pagination.pageSize,
          total: currentPagination.total,
        }
      }
    });
  }
}
