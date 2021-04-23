import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AuthState, AuthStore } from '../store';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<AuthState> {
  constructor(protected store: AuthStore) {
    super(store);
  }

  get currentSetting() {
    return this.getValue();
  }

  get bearerToken() {
    return `Bearer ${this.getValue().auth.accessToken}`;
  }

  selectDarkTheme$ = this.select((state) => state.currentUser.darkTheme);
  // selectCurrentUserClaims$ = this.select((state) => state.currentUser.claims);
  selectFullName$ = this.select(
    (store) => `${store.currentUser.firstName} ${store.currentUser.lastName}`
  );

  get isAuth() {
    return !!this.getValue().auth.accessToken;
  }
}
