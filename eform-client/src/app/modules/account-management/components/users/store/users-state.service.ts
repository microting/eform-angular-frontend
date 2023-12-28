import {Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {
  CommonPaginationState,
  OperationDataResult,
  Paged,
  PaginationModel,
  UserInfoModel,
  UserInfoRequestModel,
} from 'src/app/common/models';
import {AdminService} from 'src/app/common/services';
import {updateTableSort} from 'src/app/common/helpers';
import {Store} from '@ngrx/store';
import {
  selectUsersPagination,
  updateUsersPagination,
  updateUsersTotal
} from 'src/app/state';

@Injectable({providedIn: 'root'})
export class UsersStateService {
  private selectUsersPagination$ = this.store.select(selectUsersPagination);
  currentPagination: CommonPaginationState;

  constructor(
    private store: Store,
    private service: AdminService,
  ) {
    this.selectUsersPagination$.subscribe(x => this.currentPagination = x);
  }

  getAllUsers(): Observable<OperationDataResult<Paged<UserInfoModel>>> {
    let userInfoRequestModel: UserInfoRequestModel = {
      sort: this.currentPagination.sort,
      isSortDsc: this.currentPagination.isSortDsc,
      offset: this.currentPagination.offset,
      pageSize: this.currentPagination.pageSize,
    };
    return this.service.getAllUsers(userInfoRequestModel).pipe(
      tap((response) => {
        if (response && response.success && response.model) {
          this.store.dispatch(updateUsersTotal({total: response.model.total}));
        }
      })
    );
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.currentPagination.sort,
      this.currentPagination.isSortDsc
    );
    this.store.dispatch(updateUsersPagination({
      pagination: {
        ...this.currentPagination,
        sort: localPageSettings.sort,
        isSortDsc: localPageSettings.isSortDsc,
      }
    }));
  }

  onDelete() {
    this.store.dispatch(updateUsersTotal({total: this.currentPagination.total - 1}));
  }

  updatePagination(pagination: PaginationModel) {
    this.store.dispatch(updateUsersPagination({
      pagination: {
        ...this.currentPagination,
        offset: pagination.offset,
        pageSize: pagination.pageSize,
      }
    }));
  }
}
