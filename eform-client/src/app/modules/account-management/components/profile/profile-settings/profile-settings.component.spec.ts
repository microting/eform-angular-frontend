import {TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Store} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';
import {describe, expect, it, vi} from 'vitest';
import {AuthStateService} from 'src/app/common/store';
import {GoogleAuthService, LocaleService, UserSettingsService} from 'src/app/common/services/auth';
import {AppSettingsStateService} from 'src/app/modules/application-settings/components/store';
import {EformNewSubheaderComponent} from 'src/app/common/modules/eform-shared/components/eform-new-subheader/eform-new-subheader.component';
import {ProfileSettingsComponent} from './profile-settings.component';

describe('ProfileSettingsComponent', () => {
  const setup = (themeMode: string) => {
    const model = {locale: 'en-US', formats: 'en-US', timeZone: 'UTC', darkTheme: true, themeMode, languageId: 1};
    const updateUserSettings = vi.fn(() => of({success: true}));
    const getUserSettings = vi.fn(() => of({model: {...model}}));
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {provide: Store, useValue: {select: () => of(true), dispatch: vi.fn()}},
        {provide: AuthStateService, useValue: {}},
        {provide: GoogleAuthService, useValue: {getGoogleAuthenticatorInformation: () => of({model: {}})}},
        {provide: LocaleService, useValue: {}},
        {provide: UserSettingsService, useValue: {getUserSettings, updateUserSettings}},
        {
          provide: AppSettingsStateService,
          useValue: {getLanguages: () => of({success: true, model: {languages: []}})},
        },
      ],
    }).overrideComponent(ProfileSettingsComponent, {
      remove: {imports: [EformNewSubheaderComponent]},
      add: {schemas: [NO_ERRORS_SCHEMA]},
    });
    const fixture = TestBed.createComponent(ProfileSettingsComponent);
    const component = fixture.componentInstance;
    vi.spyOn(component as any, 'getTimeZones').mockImplementation(() => {});
    vi.spyOn(component as any, 'getGoogleAuthenticatorInfo').mockImplementation(() => {});
    fixture.detectChanges();
    return {fixture, component, updateUserSettings};
  };

  it('patches_TheControl_FromTheLoadedSettings', () => {
    const {component} = setup('light');
    expect(component.profileForm.value.themeMode).toBe('light');
  });

  it('save_SendsTheSelectedMode', () => {
    const {component, updateUserSettings} = setup('system');
    component.profileForm.patchValue({themeMode: 'dark'});
    component.updateUserProfileSettings();
    expect((updateUserSettings.mock.calls[0] as any[])[0].themeMode).toBe('dark');
  });

  it('save_DoesNotSendDarkTheme', () => {
    const {component, updateUserSettings} = setup('dark');
    // the loaded darkTheme (true) must reach the server untouched, not recomputed from the form
    component.profileForm.patchValue({themeMode: 'light'});
    component.updateUserProfileSettings();
    expect((updateUserSettings.mock.calls[0] as any[])[0].darkTheme).toBe(true);
  });

  it('shows_ThreeOptions_InOrder', () => {
    const {fixture} = setup('system');
    fixture.detectChanges();
    const toggles = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('mat-button-toggle')
    );
    expect(toggles.map((t) => t.getAttribute('value'))).toEqual(['system', 'light', 'dark']);
    expect(toggles.map((t) => t.textContent!.trim())).toEqual(['Follow system', 'Light', 'Dark']);
  });
});
