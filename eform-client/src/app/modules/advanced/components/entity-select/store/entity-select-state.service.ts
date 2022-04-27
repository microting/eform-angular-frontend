import {Injectable} from '@angular/core';
import {EntitySelectService} from 'src/app/common/services';
import {
  AdvEntitySelectableGroupModel,
  OperationDataResult,
  Paged,
  PaginationModel,
} from 'src/app/common/models';
import {Observable} from 'rxjs';
import {EntitySelectQuery, EntitySelectStore} from '../store';
import {updateTableSort} from 'src/app/common/helpers';
import {getOffset} from 'src/app/common/helpers/pagination.helper';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class EntitySelectStateService {
  constructor(
    private store: EntitySelectStore,
    private service: EntitySelectService,
    private query: EntitySelectQuery
  ) {
  }

  getEntitySelectableGroupList(): Observable<OperationDataResult<Paged<AdvEntitySelectableGroupModel>>> {
    return this.service
      .getEntitySelectableGroupList({
        ...this.query.pageSetting.pagination,
        ...this.query.pageSetting.filters,
        pageIndex: 0,
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

  updateNameFilter(nameFilter: string) {
    this.store.update((state) => ({
      pagination: {...state.pagination, offset: 0},
      filters: {...state.filters, nameFilter: nameFilter},
    }));
  }

  /*updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        pageSize: pageSize,
      },
    }));
    this.checkOffset();
  }*/

  /*getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }*/

  // getSort(): Observable<SortModel> {
  //   return this.query.selectSort$;
  // }

  getActiveSort(): Observable<string> {
    return this.query.selectActiveSort$;
  }

  getActiveSortDirection(): Observable<'asc' | 'desc'> {
    return this.query.selectActiveSortDirection$;
  }

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }

  /*changePage(offset: number) {
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
  }*/

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

  updatePagination(pagination: PaginationModel) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        pageSize: pagination.pageSize,
        offset: pagination.offset,
      },
    }));
    // this.checkOffset();
  }
}
