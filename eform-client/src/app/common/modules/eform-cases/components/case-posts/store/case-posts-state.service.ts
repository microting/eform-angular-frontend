import { Injectable } from '@angular/core';
import { CasePostsService } from 'src/app/common/services';
import { Observable } from 'rxjs';
import {
  CasePostsListModel,
  OperationDataResult,
  PaginationModel,
  SortModel,
} from 'src/app/common/models';
import {
  updateTablePage,
  updateTableSort,
  getOffset,
} from 'src/app/common/helpers';
import { map } from 'rxjs/operators';
import { CasePostsQuery, CasePostsStore } from './';

@Injectable({ providedIn: 'root' })
export class CasePostsStateService {
  constructor(
    private store: CasePostsStore,
    private service: CasePostsService,
    private query: CasePostsQuery
  ) {}

  private templateId: number;
  private caseId: number;

  getAllPosts(): Observable<OperationDataResult<CasePostsListModel>> {
    return this.service
      .getAllPosts({
        ...this.query.pageSetting.pagination,
        ...this.query.pageSetting.filters,
        templateId: this.templateId,
        caseId: this.caseId,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.update(() => ({
              total: response.model.total,
            }));
          }
          return response;
        })
      );
  }

  setTemplateId(templateId: number) {
    this.templateId = templateId;
  }

  setCaseId(caseId: number) {
    this.caseId = caseId;
  }

  updateNameFilter(nameFilter: string) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
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

  /*  getSort(): Observable<SortModel> {
      return this.query.selectSort$;
    }*/

  getActiveSort(): Observable<string> {
    return this.query.selectActiveSort$;
  }

  getActiveSortDirection(): Observable<'asc' | 'desc'> {
    return this.query.selectActiveSortDirection$;
  }

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }

  changePage(offset: number) {
    const updatedPageSetting = updateTablePage(offset, {
      ...this.query.pageSetting.pagination,
    });
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        offset: updatedPageSetting.offset,
      },
    }));
  }

  onDelete() {
    this.store.update((state) => ({
      total: state.total - 1,
    }));
    this.checkOffset();
  }

  onSortTable(sort: string) {
    const localPageSetting = updateTableSort(
      sort,
      this.query.pageSetting.pagination.sort,
      this.query.pageSetting.pagination.isSortDsc
    );
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        isSortDsc: localPageSetting.isSortDsc,
        sort: localPageSetting.sort,
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
        },
      }));
    }
  }

  getPagination(): Observable<PaginationModel> {
    return this.query.selectPagination$;
  }
}
