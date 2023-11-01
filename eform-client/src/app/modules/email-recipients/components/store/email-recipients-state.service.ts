import { Injectable } from '@angular/core';
import { EmailRecipientsService } from 'src/app/common/services';
import {
  CommonPaginationState,
  EmailRecipientModel, EmailRecipientsRequestModel, FiltrationStateModel,
  OperationDataResult,
  Paged,
  PaginationModel,
} from 'src/app/common/models';
import {Observable, zip} from 'rxjs';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {updateTableSort} from 'src/app/common/helpers';
import {
  selectEmailRecipientsFilters,
  selectEmailRecipientsPagination
} from 'src/app/state/email-recipients/email-recipiencts.selector';

@Injectable({ providedIn: 'root' })
export class EmailRecipientsStateService {
  private emailRecipientsFilters$ = this.store.select(selectEmailRecipientsFilters);
    private emailRecipientsPagination$ = this.store.select(selectEmailRecipientsPagination);
  constructor(
    private store: Store,
    private service: EmailRecipientsService,
  ) {}

  getEmailRecipients(): Observable<
    OperationDataResult<Paged<EmailRecipientModel>>
  > {
    let emailRecipientsRequestModel = new EmailRecipientsRequestModel();
    zip(this.emailRecipientsPagination$, this.emailRecipientsFilters$).subscribe(([pagination, filters]) => {
        if (pagination === undefined || filters === undefined) {
            return;
        }
        emailRecipientsRequestModel = {
            sort: pagination.sort,
            pageIndex: 0,
            pageSize: pagination.pageSize,
            isSortDsc: pagination.isSortDsc,
            offset: pagination.offset,
            tagIds: filters.tagIds,
        }
    }).unsubscribe();
    return this.service.getEmailRecipients(emailRecipientsRequestModel).pipe(
      map((response) => {
        if (response && response.success && response.model) {
          this.store.dispatch({type: '[EmailRecipients] Update EmailRecipients Total', payload: {total: response.model.total}});
        }
        return response;
      })
    );
  }

  addOrRemoveTagIds(id: number) {
    let currentFilters: FiltrationStateModel;
    this.emailRecipientsFilters$.subscribe((filters) => {
      if (filters === undefined) {
        return;
      }
      currentFilters = filters;
    }).unsubscribe();
    const newTagIds = [...currentFilters.tagIds];
    this.store.dispatch({
      type: '[EmailRecipients] Update EmailRecipients Filters',
      payload: {filters: {tagIds: newTagIds}}
    });
  }

  onSortTable(sort: string) {
    let currentPagination: CommonPaginationState;
    this.emailRecipientsPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    const localPageSetting = updateTableSort(
        sort,
        currentPagination.sort,
        currentPagination.isSortDsc
        );
    this.store.dispatch({type: '[EmailRecipients] Update EmailRecipients Pagination', payload: {pagination: {
          sort: localPageSetting.sort,
          isSortDsc: localPageSetting.isSortDsc,
          offset: currentPagination.offset,
          pageIndex: currentPagination.pageIndex,
          pageSize: currentPagination.pageSize,
          total: currentPagination.total,
        }}});
  }

  onDelete() {
    let currentPagination: CommonPaginationState;
    this.emailRecipientsPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({type: '[EmailRecipients] Update EmailRecipients Pagination', payload: {pagination: {
          sort: currentPagination.sort,
          isSortDsc: currentPagination.isSortDsc,
          offset: currentPagination.offset,
          pageIndex: currentPagination.pageIndex,
          pageSize: currentPagination.pageSize,
          total: currentPagination.total - 1,
        }}});
  }

  updatePagination(pagination: PaginationModel) {
    let currentPagination: CommonPaginationState;
    this.emailRecipientsPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({type: '[EmailRecipients] Update EmailRecipients Pagination', payload: {pagination: {
          sort: currentPagination.sort,
          isSortDsc: currentPagination.isSortDsc,
          offset: pagination.offset,
          pageIndex: currentPagination.pageIndex,
          pageSize: pagination.pageSize,
          total: currentPagination.total,
        }}});
  }
}
