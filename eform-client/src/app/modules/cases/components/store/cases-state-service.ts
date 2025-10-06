import { Injectable, inject } from '@angular/core';
import {CasesService, EFormService} from 'src/app/common/services';
import {Observable} from 'rxjs';
import {
  CaseListModel,
  CasesRequestModel,
  CommonPaginationState,
  FiltrationStateModel,
  OperationDataResult,
  PaginationModel,
  TemplateDto,
} from 'src/app/common/models';
import {updateTableSort} from 'src/app/common/helpers';
import {filter, map, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {
  updateCasesFilters,
  updateCasesPagination,
  selectCasesFilters,
  selectCasesPagination
} from 'src/app/state';

@Injectable({providedIn: 'root'})
export class CasesStateService {
  private store = inject(Store);
  private service = inject(CasesService);
  private eFormService = inject(EFormService);

  private selectCasesPagination$ = this.store.select(selectCasesPagination);
  private selectCasesFilters$ = this.store.select(selectCasesFilters);

  constructor() {
    this.selectCasesPagination$.pipe(
      filter(x => !!x),
      tap(x => this.currentPagination = x)
    ).subscribe();

    this.selectCasesFilters$.pipe(
      filter(x => !!x),
      tap(x => this.currentFiltration = x)
    ).subscribe();
  }

  private templateId: number;
  private currentPagination: CommonPaginationState;
  private currentFiltration: FiltrationStateModel;

  loadTemplateData(): Observable<OperationDataResult<TemplateDto>> {
    return this.eFormService.getSingle(this.templateId);
  }

  getCases(): Observable<OperationDataResult<CaseListModel>> {
    const casesRequestModel: CasesRequestModel = {
      sort: this.currentPagination.sort,
      isSortDsc: this.currentPagination.isSortDsc,
      offset: this.currentPagination.offset,
      pageSize: this.currentPagination.pageSize,
      nameFilter: this.currentFiltration.nameFilter,
      templateId: this.templateId,
    };
    return this.service.getCases(casesRequestModel).pipe(
      map((response) => {
        if (response && response.success && response.model) {
          this.store.dispatch(
            updateCasesPagination({
              pagination: {
                sort: casesRequestModel.sort,
                isSortDsc: casesRequestModel.isSortDsc,
                offset: casesRequestModel.offset,
                pageSize: casesRequestModel.pageSize,
                pageIndex: this.currentPagination.pageIndex,
                total: response.model.numOfElements,
              }
            }));
        }
        return response;
      })
    );
  }

  setTemplateId(templateId: number) {
    this.templateId = templateId;
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch(updateCasesFilters({
      filters: {nameFilter: nameFilter, tagIds: this.currentFiltration.tagIds}
    }));
  }


  onDelete() {
    if (this.currentPagination.offset !== 0) {
      this.store.dispatch(
        updateCasesPagination({
          pagination: {
            ...this.currentPagination,
            offset: this.currentPagination.offset - 1,
          }
        }));
    }
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.currentPagination.sort,
      this.currentPagination.isSortDsc
    );
    this.store.dispatch(
      updateCasesPagination({
        pagination: {
          ...this.currentPagination,
          sort: localPageSettings.sort,
          isSortDsc: localPageSettings.isSortDsc,
        }
      }));
  }

  updatePagination(pagination: PaginationModel) {
    this.store.dispatch(
      updateCasesPagination({
        pagination: {
          ...this.currentPagination,
          offset: pagination.offset,
          pageSize: pagination.pageSize,
        }
      }));
  }
}
