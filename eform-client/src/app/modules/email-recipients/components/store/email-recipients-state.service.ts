import { Injectable, inject } from '@angular/core';
import {EmailRecipientsService} from 'src/app/common/services';
import {
  CommonPaginationState,
  EmailRecipientModel,
  EmailRecipientsRequestModel,
  OperationDataResult,
  Paged,
  PaginationModel,
} from 'src/app/common/models';
import {Observable, tap} from 'rxjs';
import {Store} from '@ngrx/store';
import {arrayToggle, updateTableSort} from 'src/app/common/helpers';
import {
  selectEmailRecipientsFilters,
  selectEmailRecipientsPagination,
  EmailRecipientsFilters,
  emailRecipientsUpdateTotal,
  emailRecipientsUpdateFilters,
  emailRecipientsUpdatePagination
} from 'src/app/state';

@Injectable({providedIn: 'root'})
export class EmailRecipientsStateService {
  private store = inject(Store);
  private service = inject(EmailRecipientsService);

  private emailRecipientsFilters$ = this.store.select(selectEmailRecipientsFilters);
  private emailRecipientsPagination$ = this.store.select(selectEmailRecipientsPagination);
  currentPagination: CommonPaginationState;
  currentFilters: EmailRecipientsFilters;

  constructor() {
    this.emailRecipientsPagination$.subscribe(x => this.currentPagination = x);
    this.emailRecipientsFilters$.subscribe(x => this.currentFilters = x);
  }

  getEmailRecipients(): Observable<OperationDataResult<Paged<EmailRecipientModel>>> {
    const emailRecipientsRequestModel: EmailRecipientsRequestModel = {
      sort: this.currentPagination.sort,
      pageIndex: 0,
      pageSize: this.currentPagination.pageSize,
      isSortDsc: this.currentPagination.isSortDsc,
      offset: this.currentPagination.offset,
      tagIds: this.currentFilters.tagIds,
    };
    return this.service.getEmailRecipients(emailRecipientsRequestModel).pipe(
      tap((response) => {
        if (response && response.success && response.model) {
          this.store.dispatch(emailRecipientsUpdateTotal({total: response.model.total}));
        }
      })
    );
  }

  addOrRemoveTagIds(id: number) {
    this.store.dispatch(emailRecipientsUpdateFilters({filters: {tagIds: arrayToggle(this.currentFilters.tagIds, id)}}));
  }

  onSortTable(sort: string) {
    const localPageSetting = updateTableSort(
      sort,
      this.currentPagination.sort,
      this.currentPagination.isSortDsc
    );
    this.store.dispatch(emailRecipientsUpdatePagination({
      pagination: {
        ...this.currentPagination,
        sort: localPageSetting.sort,
        isSortDsc: localPageSetting.isSortDsc,
      }
    }));
  }

  onDelete() {
    this.store.dispatch(emailRecipientsUpdateTotal({total: this.currentPagination.total - 1}));
  }

  updatePagination(pagination: PaginationModel) {
    this.store.dispatch(emailRecipientsUpdatePagination({
      pagination: {
        ...this.currentPagination,
        offset: pagination.offset,
        pageSize: pagination.pageSize,
      }
    }));
  }
}
