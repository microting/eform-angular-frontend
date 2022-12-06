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
    return `Bearer ${this.getValue().token.accessToken}`;
  }

  selectDarkTheme$ = this.select((state) => state.currentUser.darkTheme);
  selectCurrentUserClaims$ = this.select((state) => state.currentUser.claims);
  selectFullName$ = this.select((store) => `${store.currentUser.firstName} ${store.currentUser.lastName}`);
  selectIsAuth$ = this.select((store) => !!store.token.accessToken);
  selectCurrentUserLocale$ = this.select((state) => state.currentUser.locale);

  get isAuth() {
    return !!this.getValue().token.accessToken;
  }

  get currentUserFullName(): string {
    return `${this.currentSetting.currentUser.firstName} ${this.currentSetting.currentUser.lastName}`;
  }
}
