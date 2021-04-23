import { Injectable } from '@angular/core';
import { EmailRecipientsStore } from './email-recipients.store';
import { EmailRecipientsService } from 'src/app/common/services';
import {
  EmailRecipientModel,
  OperationDataResult,
  Paged,
} from 'src/app/common/models';
import { Observable } from 'rxjs';
import { EmailRecipientsQuery } from './email-recipients.query';
import { updateTablePage, updateTableSort } from 'src/app/common/helpers';
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

  private total: number;

  getEmailRecipients(): Observable<
    OperationDataResult<Paged<EmailRecipientModel>>
  > {
    return this.service
      .getEmailRecipients({
        isSortDsc: this.query.pageSetting.pagination.isSortDsc,
        offset: this.query.pageSetting.pagination.offset,
        pageIndex: 0,
        pageSize: this.query.pageSetting.pagination.pageSize,
        sort: this.query.pageSetting.pagination.sort,
        tagIds: this.query.pageSetting.pagination.tagIds,
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

  addOrRemoveTagIds(id: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        tagIds: arrayToggle(state.pagination.tagIds, id),
      },
    }));
  }

  getTagIds(): Observable<number[]> {
    return this.query.selectTagsIds$;
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

  changePage(offset: number) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, offset: offset },
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
        pagination: { ...state.pagination, offset: newOffset },
      }));
    }
  }

  onDelete() {
    this.total -= 1;
    this.checkOffset();
  }
}
