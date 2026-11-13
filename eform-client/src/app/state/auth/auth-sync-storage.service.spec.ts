import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {provideStore, Store} from '@ngrx/store';
import {AuthSyncStorageService, AUTH_LOCALSTORAGE_KEY, THEME_MODE_LOCALSTORAGE_KEY} from './auth-sync-storage.service';
import {authInitialState, authReducer, AUTH_REDUCER_NODE} from './auth.recuder';
import {logout, updateThemeMode} from './auth.actions';
import {selectThemeMode} from './auth.selector';

describe('AuthSyncStorageService theme mode', () => {
  let store: Store<any>;
  let service: AuthSyncStorageService;

  function setup() {
    TestBed.configureTestingModule({
      providers: [provideStore({[AUTH_REDUCER_NODE]: authReducer})],
    });
    store = TestBed.inject(Store);
    service = TestBed.inject(AuthSyncStorageService);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('writes_TheModeToItsOwnKey_WhenTheStoreChanges', () => {
    setup();
    service.init();
    store.dispatch(updateThemeMode('dark'));
    expect(localStorage.getItem(THEME_MODE_LOCALSTORAGE_KEY)).toBe('dark');
    store.dispatch(updateThemeMode('light'));
    expect(localStorage.getItem(THEME_MODE_LOCALSTORAGE_KEY)).toBe('light');
  });

  it('resolves_ToTheOs_AfterLogout', () => {
    setup();
    service.init();
    store.dispatch(updateThemeMode('dark'));
    store.dispatch(logout());
    // a signed-out browser must follow the OS: the key is absent or 'system'
    const key = localStorage.getItem(THEME_MODE_LOCALSTORAGE_KEY);
    expect(key === null || key === 'system').toBe(true);
  });

  it('reads_TheKey_OnInit', () => {
    const state = {...authInitialState, currentUser: {...authInitialState.currentUser, themeMode: 'dark'}};
    localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify(state));
    setup();
    service.init();
    let mode: string;
    store.select(selectThemeMode).subscribe(m => mode = m).unsubscribe();
    expect(mode).toBe('dark');
    expect(localStorage.getItem(THEME_MODE_LOCALSTORAGE_KEY)).toBe('dark');
  });

  it('survives_AnUnparseableKey', () => {
    localStorage.setItem(AUTH_LOCALSTORAGE_KEY, '{not json');
    localStorage.setItem(THEME_MODE_LOCALSTORAGE_KEY, '%%%');
    setup();
    expect(() => service.init()).not.toThrow();
    let mode: string;
    store.select(selectThemeMode).subscribe(m => mode = m).unsubscribe();
    expect(mode).toBe('system');
  });
});
