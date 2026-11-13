import { Injectable, inject } from '@angular/core';
import {authFeatureSelector, AuthState, loadAuthState} from 'src/app/state';
import {select, Store} from '@ngrx/store';
import {filter} from 'rxjs/operators';

export const AUTH_LOCALSTORAGE_KEY = 'auth';
// read synchronously by the inline script in index.html before Angular boots
export const THEME_MODE_LOCALSTORAGE_KEY = 'theme-mode';

@Injectable({
  providedIn: 'root'
})
// this service saves the current state of the store and restores it from local storage
export class AuthSyncStorageService {
  private store$ = inject<Store<AuthState>>(Store);

  private isInit = false;

  init() {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
    this.loadFromStorage();

    this.store$.pipe(
      select(authFeatureSelector),
      filter(state => !!state)
    ).subscribe(state => {
      localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify(state));
      try {
        localStorage.setItem(THEME_MODE_LOCALSTORAGE_KEY, state.currentUser?.themeMode || 'system');
      } catch (e) {
        // blocked or full storage must not break the store
      }
    });

    window.addEventListener('storage', () => this.loadFromStorage()); // sync storage between tabs
  }

  private loadFromStorage() {
    const state = localStorage.getItem(AUTH_LOCALSTORAGE_KEY);
    if (state) {
      try {
        this.store$.dispatch(loadAuthState({state: JSON.parse(state)}));
      } catch (e) {
        // an unparseable blob is ignored; the initial state stands
      }
    }
  }
}
