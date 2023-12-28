import { Injectable } from '@angular/core';
import { DeviceUserService } from 'src/app/common/services';
import { OperationDataResult, SiteDto } from 'src/app/common/models';
import { Observable } from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {updateDeviceUserFilters, selectDeviceUsersFilters, DeviceUsersFilters} from 'src/app/state';

@Injectable({ providedIn: 'root' })
export class DeviceUsersStateService {
  private selectDeviceUsersFilters$ = this.store.select(selectDeviceUsersFilters);
  currentFilters: DeviceUsersFilters;
  constructor(
    private service: DeviceUserService,
    private store: Store,
  ) {
    this.selectDeviceUsersFilters$.pipe(
      filter(x => !!x),
      tap(x => this.currentFilters = x)
    ).subscribe()
  }

  getDeviceUsersFiltered(): Observable<OperationDataResult<Array<SiteDto>>> {
    return this.service
      .getDeviceUsersFiltered({
        ...this.currentFilters,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch(updateDeviceUserFilters({nameFilter: nameFilter}));
  }
}
