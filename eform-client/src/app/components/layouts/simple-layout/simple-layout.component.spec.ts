import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {Store} from '@ngrx/store';
import {of, ReplaySubject} from 'rxjs';
import {describe, expect, it, vi} from 'vitest';
import {AuthStateService} from 'src/app/common/store';
import {AppSettingsService} from 'src/app/common/services';
import {ThemeModeService} from 'src/app/common/services/theme-mode.service';
import {SimpleLayoutComponent} from './simple-layout.component';

describe('SimpleLayoutComponent', () => {
  const setup = (themeMode: string, darkTheme: boolean) => {
    const setMode = vi.fn();
    const appearance$ = new ReplaySubject<'light' | 'dark'>(1);
    const state = {auth: {currentUser: {themeMode, darkTheme}}};
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {provide: Store, useValue: {select: (sel: any) => of(sel(state)), dispatch: vi.fn()}},
        {provide: AuthStateService, useValue: {initLocale: vi.fn()}},
        {provide: AppSettingsService, useValue: {connectionStringExist: () => of({success: true})}},
        {provide: ThemeModeService, useValue: {setMode, appearance$}},
      ],
    });
    const fixture = TestBed.createComponent(SimpleLayoutComponent);
    fixture.detectChanges();
    return {setMode, fixture};
  };

  it('passesTheStoredMode_NotSystem_ToTheSingleton', () => {
    const {setMode} = setup('dark', true);
    expect(setMode).toHaveBeenCalledWith('dark', true);
    expect(setMode).not.toHaveBeenCalledWith('system', expect.anything());
  });

  it('passesSystem_WhenTheStoreIsAtItsSignedOutDefault', () => {
    const {setMode} = setup('system', false);
    expect(setMode).toHaveBeenCalledWith('system', false);
  });
});
