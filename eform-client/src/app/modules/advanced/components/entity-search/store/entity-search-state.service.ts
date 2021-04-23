import { Injectable } from '@angular/core';
import { EntitySearchStore } from './entity-search.store';
import { EntitySearchService } from 'src/app/common/services';
import {
  AdvEntitySearchableGroupListModel,
  OperationDataResult,
} from 'src/app/common/models';
import { Observable } from 'rxjs';
import { EntitySearchQuery } from './entity-search.query';

@Injectable({ providedIn: 'root' })
export class EntitySearchStateService {
  constructor(
    private store: EntitySearchStore,
    private service: EntitySearchService,
    private query: EntitySearchQuery
  ) {}

  getEntitySearchableGroupList(): Observable<
    OperationDataResult<AdvEntitySearchableGroupListModel>
  > {
    return this.service.getEntitySearchableGroupList({
      isSortDsc: this.query.pageSetting.pagination.isSortDsc,
      nameFilter: this.query.pageSetting.pagination.nameFilter,
      offset: this.query.pageSetting.pagination.offset,
      pageIndex: this.query.pageSetting.pagination.pageIndex,
      pageSize: this.query.pageSetting.pagination.pageSize,
      sort: this.query.pageSetting.pagination.sort,
    });
  }

  updatePageIndex(offset: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        pageIndex: offset / this.query.pageSetting.pagination.pageSize,
      },
    }));
  }

  updateNameFilter(nameFilter: string) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, nameFilter: nameFilter },
    }));
  }

  get sort(): string {
    return this.query.pageSetting.pagination.sort;
  }

  get isSortDsc(): boolean {
    return this.query.pageSetting.pagination.isSortDsc;
  }

  updateSort(sort: string) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, sort: sort },
    }));
  }

  updateIsSortDsc(isSortDsc: boolean) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, isSortDsc: isSortDsc },
    }));
  }

  updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, pageSize: pageSize },
    }));
  }

  getOffset(): number {
    return this.query.pageOffset;
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
}
