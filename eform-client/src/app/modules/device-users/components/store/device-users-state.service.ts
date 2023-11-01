import { Injectable } from '@angular/core';
import { DeviceUserService } from 'src/app/common/services';
import { OperationDataResult, SiteDto } from 'src/app/common/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {selectDeviceUsersFilters} from 'src/app/state/device-user/device-user.selector';

@Injectable({ providedIn: 'root' })
export class DeviceUsersStateService {
  private selectDeviceUsersFilters$ = this.store.select(selectDeviceUsersFilters);
  constructor(
    private service: DeviceUserService,
    private store: Store,
  ) {}

  getDeviceUsersFiltered(): Observable<OperationDataResult<Array<SiteDto>>> {
    let currentFilters: any;
    this.selectDeviceUsersFilters$.subscribe((filters) => {
      if (filters === undefined) {
        return;
      }
      currentFilters = filters;
    }).unsubscribe();
    return this.service
      .getDeviceUsersFiltered({
        ...currentFilters,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch({type: '[DeviceUser] Update DeviceUser Filters', payload: {filters: {nameFilter: nameFilter}}});
  }
}
