import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface PairingState {
  tagIds: number[];
}

export function createInitialState(): PairingState {
  return {
    tagIds: [],
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'pairing' })
export class PairingStore extends Store<PairingState> {
  constructor() {
    super(createInitialState());
  }
}
