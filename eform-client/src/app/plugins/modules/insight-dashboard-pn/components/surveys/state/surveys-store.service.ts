import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface SurveysState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  offset: number;
}

export function createInitialState(): SurveysState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'surveys' })
export class SurveysStore extends Store<SurveysState> {
  constructor() {
    super(createInitialState());
  }
}
