import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DeviceUsersStore, DeviceUsersState } from './device-users.store';

@Injectable({ providedIn: 'root' })
export class DeviceUsersQuery extends Query<DeviceUsersState> {
  constructor(protected store: DeviceUsersStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectNameFilter$ = this.select((state) => state.filters.nameFilter);
}
