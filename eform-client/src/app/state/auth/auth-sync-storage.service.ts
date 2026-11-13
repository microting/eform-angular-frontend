import { Injectable, inject } from '@angular/core';
import {authFeatureSelector, AuthState, loadAuthState} from 'src/app/state';
import {select, Store} from '@ngrx/store';
import {filter} from 'rxjs/operators';
import {deriveThemeMode} from './theme-mode-derivation';

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
      try {
        // storage can be unavailable (private window, blocked site data); the store must keep working
        localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify(state));
        localStorage.setItem(THEME_MODE_LOCALSTORAGE_KEY, deriveThemeMode(state.currentUser));
      } catch (e) {
        // ignore
      }
    });

    window.addEventListener('storage', () => this.loadFromStorage()); // sync storage between tabs
  }

  private loadFromStorage() {
    const raw = localStorage.getItem(AUTH_LOCALSTORAGE_KEY);
    if (!raw) {
      return;
    }
    let parsed: AuthState;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return; // an unparseable blob is ignored; the initial state stands
    }
    this.store$.dispatch(loadAuthState({state: parsed}));
  }
}
