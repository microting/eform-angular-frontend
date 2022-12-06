import { Injectable } from '@angular/core';
import { EmailRecipientsService } from 'src/app/common/services';
import {
  EmailRecipientModel,
  OperationDataResult,
  Paged,
  PaginationModel,
} from 'src/app/common/models';
import { Observable } from 'rxjs';
import { EmailRecipientsQuery, EmailRecipientsStore } from './';
import { updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { arrayToggle } from '@datorama/akita';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EmailRecipientsStateService {
  constructor(
    private store: EmailRecipientsStore,
    private service: EmailRecipientsService,
    private query: EmailRecipientsQuery
  ) {}

  getEmailRecipients(): Observable<
    OperationDataResult<Paged<EmailRecipientModel>>
  > {
    return this.service
      .getEmailRecipients({
        ...this.query.pageSetting.pagination,
        ...this.query.pageSetting.filters,
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

  /*updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, pageSize: pageSize },
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

  addOrRemoveTagIds(id: number) {
    this.store.update((state) => ({
      filters: {
        ...state.filters,
        tagIds: arrayToggle(state.filters.tagIds, id),
      },
    }));
  }

  getTagIds(): Observable<number[]> {
    return this.query.selectTagIds$;
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

  /*changePage(offset: number) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, offset: offset },
    }));
  }*/

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pagination.pageSize,
      this.query.pageSetting.pagination.offset,
      this.query.pageSetting.total
    );
    if (newOffset !== this.query.pageSetting.pagination.offset) {
      this.store.update((state) => ({
        pagination: { ...state.pagination, offset: newOffset },
      }));
    }
  }

  onDelete() {
    this.store.update((state) => ({
      total: state.total - 1,
    }));
    this.checkOffset();
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
