import { Injectable } from '@angular/core';
import { CasesService, EFormService } from 'src/app/common/services';
import { Observable } from 'rxjs';
import {
  CaseListModel,
  OperationDataResult,
  PaginationModel,
  SortModel,
  TemplateDto,
} from 'src/app/common/models';
import { updateTablePage, updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { CasesQuery, CasesStore } from './';

@Injectable({ providedIn: 'root' })
export class CasesStateService {
  constructor(
    private store: CasesStore,
    private service: CasesService,
    private query: CasesQuery,
    private eFormService: EFormService
  ) {}

  private total: number;
  private templateId: number;

  loadTemplateData(): Observable<OperationDataResult<TemplateDto>> {
    return this.eFormService.getSingle(this.templateId);
  }

  getCases(): Observable<OperationDataResult<CaseListModel>> {
    return this.service
      .getCases({
        isSortDsc: this.query.pageSetting.pagination.isSortDsc,
        nameFilter: this.query.pageSetting.pagination.nameFilter,
        offset: this.query.pageSetting.pagination.offset,
        pageSize: this.query.pageSetting.pagination.pageSize,
        sort: this.query.pageSetting.pagination.sort,
        templateId: this.templateId,
        pageIndex: this.query.pageSetting.pagination.pageIndex,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.update(() => ({
              total: response.model.numOfElements,
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
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        pageIndex: 0,
        offset: 0,
      },
      filters: {
        ...state.filters,
        nameFilter: nameFilter,
      },
    }));
  }

  updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, pageSize: pageSize },
    }));
    this.checkOffset();
  }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  getSort(): Observable<SortModel> {
    return this.query.selectSort$;
  }

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }

  changePage(offset: number) {
    const updatedPageSetting = updateTablePage(offset, {
      offset: this.query.pageSetting.pagination.offset,
      pageSize: this.query.pageSetting.pagination.pageSize,
      isSortDsc: false,
      sort: '',
      pageIndex: this.query.pageSetting.pagination.pageIndex,
    });
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        offset: updatedPageSetting.offset,
        pageIndex: updatedPageSetting.pageIndex,
      },
    }));
  }

  onDelete() {
    this.total -= 1;
    this.checkOffset();
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.pagination.sort,
      this.query.pageSetting.pagination.isSortDsc
    );
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        isSortDsc: localPageSettings.isSortDsc,
        sort: localPageSettings.sort,
      },
    }));
  }

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pagination.pageSize,
      this.query.pageSetting.pagination.offset,
      this.query.pageSetting.total
    );
    if (newOffset !== this.query.pageSetting.pagination.offset) {
      this.store.update((state) => ({
        pagination: {
          ...state.pagination,
          offset: newOffset,
          pageIndex: Math.ceil(
            this.query.pageSetting.pagination.pageSize / newOffset
          ),
        },
      }));
    }
  }

  getPagination(): Observable<PaginationModel> {
    return this.query.selectPagination$;
  }
}
