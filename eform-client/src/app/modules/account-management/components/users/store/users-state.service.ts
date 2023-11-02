import { Injectable } from '@angular/core';
import {Observable, zip} from 'rxjs';
import {
  CommonPaginationState,
  OperationDataResult,
  Paged,
  PaginationModel,
  UserInfoModel, UserInfoRequestModel,
} from 'src/app/common/models';
import { AdminService } from 'src/app/common/services';
import { updateTableSort } from 'src/app/common/helpers';
import { map } from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {selectUsersFilters, selectUsersPagination} from 'src/app/state/users/users.selector';

@Injectable({ providedIn: 'root' })
export class UsersStateService {
  private selectUsersPagination$ = this.store.select(selectUsersPagination);
  private selectUsersFilters$ = this.store.select(selectUsersFilters);
  constructor(
    private store: Store,
    private service: AdminService,
  ) {}

  getAllUsers(): Observable<OperationDataResult<Paged<UserInfoModel>>> {
    let userInfoRequestModel = new UserInfoRequestModel();
    zip(this.selectUsersPagination$, this.selectUsersFilters$).subscribe(([pagination, filters]) => {
      if (pagination === undefined || filters === undefined) {
        return;
      }
      userInfoRequestModel = {
        sort: pagination.sort,
        isSortDsc: pagination.isSortDsc,
        offset: pagination.offset,
        pageSize: pagination.pageSize,
      };
    }).unsubscribe();
    return this.service.getAllUsers(userInfoRequestModel).pipe(
      map((response) => {
        if (response && response.success && response.model) {
          this.store.dispatch({
            type: '[Users] Update Users Pagination', payload: {
              pagination: {
                sort: userInfoRequestModel.sort,
                isSortDsc: userInfoRequestModel.isSortDsc,
                offset: userInfoRequestModel.offset,
                pageSize: userInfoRequestModel.pageSize,
                total: response.model.total,
              }
            }
          });
        }
        return response;
      })
    );
  }
  onSortTable(sort: string) {
    let currentPagination: CommonPaginationState;
    this.selectUsersPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    const localPageSettings = updateTableSort(
      sort,
      currentPagination.sort,
      currentPagination.isSortDsc
    );
    this.store.dispatch({
      type: '[Users] Update Users Pagination', payload: {
        pagination: {
          sort: localPageSettings.sort,
          isSortDsc: localPageSettings.isSortDsc,
          pageIndex: currentPagination.pageIndex,
          offset: currentPagination.offset,
          pageSize: currentPagination.pageSize,
          total: currentPagination.total,
        },
      }
    });
  }
  onDelete() {
    let currentPagination: CommonPaginationState;
    this.selectUsersPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({
      type: '[Users] Update Users Pagination', payload: {
        pagination: {
          sort: currentPagination.sort,
          isSortDsc: currentPagination.isSortDsc,
          pageIndex: currentPagination.pageIndex,
          offset: currentPagination.offset - 1,
          pageSize: currentPagination.pageSize,
          total: currentPagination.total,
        },
      }
    });
  }

  updatePagination(pagination: PaginationModel) {
    let currentPagination: CommonPaginationState;
    this.selectUsersPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({
      type: '[Users] Update Users Pagination', payload: {
        pagination: {
          sort: currentPagination.sort,
          isSortDsc: currentPagination.isSortDsc,
          offset: pagination.offset,
          pageSize: pagination.pageSize,
          pageIndex: currentPagination.pageIndex,
          total: currentPagination.total,
        },
      }
    });
  }
}
