import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {AppSettingsService, AuthService, LocaleService, UserSettingsService} from 'src/app/common/services';
import {AuthStateService} from 'src/app/common/store/service/auth-state.service';
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
    // The reducer is wrapped so that logout() does NOT reset the store: the only thing that can bring the
    // mode back to 'system' is the updateThemeMode('system') dispatch inside AuthStateService.logout().
    const keepOnLogout = (s: any, a: any) => a.type === logout.type ? s : authReducer(s, a);
    TestBed.configureTestingModule({
      providers: [
        provideStore({[AUTH_REDUCER_NODE]: keepOnLogout, cms: (s: any = {isCmsEnabled: false}) => s}),
        {provide: AuthService, useValue: {}},
        {provide: TranslateService, useValue: {}},
        {provide: LocaleService, useValue: {}},
        {provide: UserSettingsService, useValue: {}},
        {provide: AppSettingsService, useValue: {}},
        {provide: Router, useValue: {navigate: () => Promise.resolve(true)}},
        {provide: MAT_DATE_LOCALE, useValue: new BehaviorSubject('da')},
      ],
    });
    store = TestBed.inject(Store);
    service = TestBed.inject(AuthSyncStorageService);
    service.init();
    store.dispatch(updateThemeMode('dark'));
    expect(localStorage.getItem(THEME_MODE_LOCALSTORAGE_KEY)).toBe('dark');

    TestBed.inject(AuthStateService).logout();

    // a signed-out browser must follow the OS: the key is absent or 'system'
    const key = localStorage.getItem(THEME_MODE_LOCALSTORAGE_KEY);
    expect(key === null || key === 'system').toBe(true);
  });

  it('derivesTheMode_FromDarkTheme_WhenTheHydratedBlobPredatesIt', () => {
    const {themeMode, ...user} = {...authInitialState.currentUser, darkTheme: true} as any;
    localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify({...authInitialState, currentUser: user}));
    setup();
    service.init();
    expect(localStorage.getItem(THEME_MODE_LOCALSTORAGE_KEY)).toBe('dark');
  });

  it('derivesLight_FromDarkThemeFalse_WhenTheHydratedBlobPredatesTheMode', () => {
    const {themeMode, ...user} = {...authInitialState.currentUser, darkTheme: false} as any;
    localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify({...authInitialState, currentUser: user}));
    setup();
    service.init();
    let mode: string;
    store.select(selectThemeMode).subscribe(m => mode = m).unsubscribe();
    expect(mode).toBe('light');
    expect(localStorage.getItem(THEME_MODE_LOCALSTORAGE_KEY)).toBe('light');
  });

  it('selectThemeMode_AgreesWithTheMirror_ForADarkPreFeatureBlob', () => {
    const {themeMode, ...user} = {...authInitialState.currentUser, darkTheme: true} as any;
    localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify({...authInitialState, currentUser: user}));
    setup();
    service.init();
    let mode: string;
    store.select(selectThemeMode).subscribe(m => mode = m).unsubscribe();
    expect(mode).toBe(localStorage.getItem(THEME_MODE_LOCALSTORAGE_KEY));
    expect(mode).toBe('dark');
  });

  it('keepsWriting_TheStore_WhenStorageThrows', () => {
    setup();
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    try {
      expect(() => service.init()).not.toThrow();
      expect(() => store.dispatch(updateThemeMode('dark'))).not.toThrow();
    } finally {
      spy.mockRestore();
    }
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
