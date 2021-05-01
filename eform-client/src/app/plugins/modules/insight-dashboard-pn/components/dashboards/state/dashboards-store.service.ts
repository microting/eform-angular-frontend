import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface DashboardsState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  offset: number;
}

export function createInitialState(): DashboardsState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dashboards' })
export class DashboardsStore extends Store<DashboardsState> {
  constructor() {
    super(createInitialState());
  }
}
