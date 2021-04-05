import { Injectable } from '@angular/core';
import { CasePostsStore } from './case-posts-store';
import { CasePostsService } from 'src/app/common/services';
import { Observable } from 'rxjs';
import { CasePostsListModel, OperationDataResult } from 'src/app/common/models';
import { updateTablePage, updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { CasePostsQuery } from 'src/app/modules/cases/components/case-posts/state/case-posts-query';

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
        isSortDsc: this.query.pageSetting.isSortDsc,
        offset: this.query.pageSetting.offset,
        pageSize: this.query.pageSetting.pageSize,
        sort: this.query.pageSetting.sort,
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
    this.store.update({ nameFilter: nameFilter, pageIndex: 0, offset: 0 });
  }

  updatePageSize(pageSize: number) {
    this.store.update({ pageSize: pageSize });
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
    const updatedPageSetting = updateTablePage(offset, {
      offset: this.query.pageSetting.offset,
      pageSize: this.query.pageSetting.pageSize,
      isSortDsc: false,
      sort: '',
      pageIndex: this.query.pageSetting.pageIndex,
    });
    this.store.update({
      offset: offset,
      pageIndex: updatedPageSetting.pageIndex,
    });
  }

  onDelete() {
    this.total -= 1;
    this.checkOffset();
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.sort,
      this.query.pageSetting.isSortDsc
    );
    this.store.update({
      isSortDsc: localPageSettings.isSortDsc,
      sort: localPageSettings.sort,
    });
  }

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pageSize,
      this.query.pageSetting.offset,
      this.total
    );
    if (newOffset !== this.query.pageSetting.offset) {
      this.store.update({
        offset: newOffset,
        pageIndex: Math.ceil(this.query.pageSetting.pageSize / newOffset),
      });
    }
  }
}
