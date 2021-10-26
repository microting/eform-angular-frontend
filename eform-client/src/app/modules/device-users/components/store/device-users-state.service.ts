import { Injectable } from '@angular/core';
import { DeviceUserService } from 'src/app/common/services';
import { OperationDataResult, SiteDto } from 'src/app/common/models';
import { Observable } from 'rxjs';
import { DeviceUsersQuery, DeviceUsersStore } from '../store';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DeviceUsersStateService {
  constructor(
    private store: DeviceUsersStore,
    private service: DeviceUserService,
    private query: DeviceUsersQuery
  ) {}

  getDeviceUsersFiltered(): Observable<OperationDataResult<Array<SiteDto>>> {
    return this.service
      .getDeviceUsersFiltered({
        ...this.query.pageSetting.filters,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateNameFilter(nameFilter: string) {
    this.store.update((state) => ({
      filters: { ...state.filters, nameFilter: nameFilter },
    }));
  }

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }
}
