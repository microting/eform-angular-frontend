import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface PlanningsState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  offset: number;
  descriptionFilter: string;
  tagIds: number[];
}

export function createInitialState(): PlanningsState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    offset: 0,
    descriptionFilter: '',
    tagIds: [],
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'plannings' })
export class PlanningsStore extends Store<PlanningsState> {
  constructor() {
    super(createInitialState());
  }
}
