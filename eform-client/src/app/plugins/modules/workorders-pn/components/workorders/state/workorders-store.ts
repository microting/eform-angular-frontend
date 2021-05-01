import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface WorkordersState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  offset: number;
}

export function createInitialState(): WorkordersState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'workorders' })
export class WorkordersStore extends Store<WorkordersState> {
  constructor() {
    super(createInitialState());
  }
}
