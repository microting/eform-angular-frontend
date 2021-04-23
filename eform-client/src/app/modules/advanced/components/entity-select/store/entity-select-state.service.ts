import { Injectable } from '@angular/core';
import { EntitySelectStore } from './entity-select.store';
import { EntitySelectService } from 'src/app/common/services';
import {
  AdvEntitySelectableGroupModel,
  OperationDataResult,
  Paged,
} from 'src/app/common/models';
import { Observable } from 'rxjs';
import { EntitySelectQuery } from '../store/entity-select.query';
import { updateTablePage, updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';

@Injectable({ providedIn: 'root' })
export class EntitySelectStateService {
  constructor(
    private store: EntitySelectStore,
    private service: EntitySelectService,
    private query: EntitySelectQuery
  ) {}

  getEntitySelectableGroupList(): Observable<
    OperationDataResult<Paged<AdvEntitySelectableGroupModel>>
  > {
    return this.service.getEntitySelectableGroupList({
      isSortDsc: this.query.pageSetting.pagination.isSortDsc,
      nameFilter: this.query.pageSetting.pagination.nameFilter,
      offset: this.query.pageSetting.pagination.offset,
      pageSize: this.query.pageSetting.pagination.pageSize,
      sort: this.query.pageSetting.pagination.sort,
      pageIndex: 0,
    });
  }

  updateNameFilter(nameFilter: string) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, nameFilter: nameFilter },
    }));
  }

  updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, pageSize: pageSize },
    }));
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
      offset: this.query.pageSetting.pagination.offset,
      pageSize: this.query.pageSetting.pagination.pageSize,
      isSortDsc: false,
      sort: '',
      pageIndex: 0,
    });
    this.store.update((state) => ({
      pagination: { ...state.pagination, offset: updatedPageSetting.offset },
    }));
  }

  onDelete(total) {
    const newOffset = getOffset(
      this.query.pageSetting.pagination.pageSize,
      this.query.pageSetting.pagination.offset,
      total
    );
    if (newOffset !== this.query.pageSetting.pagination.offset) {
      this.store.update((state) => ({
        pagination: { ...state.pagination, offset: newOffset },
      }));
    }
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
}
