import { Injectable, inject } from '@angular/core';
import {authFeatureSelector, AuthState, loadAuthState} from 'src/app/state';
import {select, Store} from '@ngrx/store';
import {filter} from 'rxjs/operators';

export const AUTH_LOCALSTORAGE_KEY = 'auth';

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
    });

    window.addEventListener('storage', () => this.loadFromStorage()); // sync storage between tabs
  }

  private loadFromStorage() {
    const state = localStorage.getItem(AUTH_LOCALSTORAGE_KEY);
    if (state) {
      this.store$.dispatch(loadAuthState({state: JSON.parse(state)}));
    }
  }
}
