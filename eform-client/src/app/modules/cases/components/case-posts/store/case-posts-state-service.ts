import { Injectable } from '@angular/core';
import { CasePostsStore } from './case-posts-store';
import { CasePostsService } from 'src/app/common/services';
import { Observable } from 'rxjs';
import { CasePostsListModel, OperationDataResult } from 'src/app/common/models';
import { updateTablePage, updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { CasePostsQuery } from 'src/app/modules/cases/components/case-posts/store/case-posts-query';

@Injectable({ providedIn: 'root' })
export class CasePostsStateService {
  constructor(
    private store: CasePostsStore,
    private service: CasePostsService,
    private query: CasePostsQuery
  ) {}

  private total: number;
  private templateId: number;
  private caseId: number;

  getAllPosts(): Observable<OperationDataResult<CasePostsListModel>> {
    return this.service
      .getAllPosts({
        isSortDsc: this.query.pageSetting.pagination.isSortDsc,
        offset: this.query.pageSetting.pagination.offset,
        pageSize: this.query.pageSetting.pagination.pageSize,
        sort: this.query.pageSetting.pagination.sort,
        templateId: this.templateId,
        caseId: this.caseId,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.total = response.model.total;
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
        nameFilter: nameFilter,
        pageIndex: 0,
        offset: 0,
      },
    }));
  }

  updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, pageSize: pageSize },
    }));
    this.checkOffset();
  }

  getOffset(): Observable<number> {
    return this.query.selectOffset$;
  }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  getSort(): Observable<string> {
    return this.query.selectSort$;
  }

  getIsSortDsc(): Observable<boolean> {
    return this.query.selectIsSortDsc$;
  }

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }

  changePage(offset: number) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, offset: offset },
    }));
  }

  onDelete() {
    this.total -= 1;
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
      this.total
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
}
