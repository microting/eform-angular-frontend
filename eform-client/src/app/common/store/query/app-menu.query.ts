import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AppMenuState, AppMenuStore } from '../store';

@Injectable({ providedIn: 'root' })
export class AppMenuQuery extends QueryEntity<AppMenuState> {
  constructor(protected store: AppMenuStore) {
    super(store);
  }

  get currentAppMenu() {
    return this.getAll()[0];
  }

  userMenu$ = this.selectFirst();
  userMenuLeft$ = this.selectEntity(0, ({ leftMenu }) => leftMenu);
  userMenuRight$ = this.selectEntity(0, ({ rightMenu }) => rightMenu);
}
