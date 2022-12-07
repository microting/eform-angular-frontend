import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {UserMenuModel} from 'src/app/common/models';

export interface AppMenuState extends EntityState<UserMenuModel> {
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'appMenu', resettable: true})
export class AppMenuStore extends EntityStore<AppMenuState> {
  constructor() {
    super();
  }

  reset() {
    super.reset();
    this.setLoading(false);
  }
}
