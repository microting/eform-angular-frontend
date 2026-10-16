import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {provideMockStore} from '@ngrx/store/testing';
import {BehaviorSubject} from 'rxjs';
import {de, enUS, pt} from 'date-fns/locale';
import {AuthStateService} from './auth-state.service';
import {AppSettingsService, AuthService, LocaleService, UserSettingsService} from 'src/app/common/services';
import {customDaLocale} from 'src/app/common/const';
import {
  selectAuthIsAuth,
  selectConnectionStringExists,
  selectCurrentUserClaims,
  selectCurrentUserLanguageId,
  selectCurrentUserLocale,
} from 'src/app/state/auth/auth.selector';

/**
 * Issue #8141: Languages ids are AUTO_INCREMENT-seeded, so on a Galera tenant Dansk=3,
 * English=6, Deutsch=9. The date-picker locale must follow the user's language, not
 * whatever positional language happens to share its DB id.
 */
describe('AuthStateService.dateFnsLocale (shifted Languages ids, #8141)', () => {
  function serviceFor(user: {locale: string; languageId: number}): AuthStateService {
    TestBed.configureTestingModule({
      providers: [
        AuthStateService,
        provideMockStore({
          selectors: [
            {selector: selectAuthIsAuth, value: true},
            {selector: selectConnectionStringExists, value: true},
            {selector: selectCurrentUserClaims, value: {}},
            {selector: selectCurrentUserLocale, value: user.locale},
            {selector: selectCurrentUserLanguageId, value: user.languageId},
          ],
        }),
        {provide: AuthService, useValue: {}},
        {provide: TranslateService, useValue: {}},
        {provide: LocaleService, useValue: {}},
        {provide: Router, useValue: {}},
        {provide: UserSettingsService, useValue: {}},
        {provide: AppSettingsService, useValue: {}},
        {provide: MAT_DATE_LOCALE, useValue: new BehaviorSubject(null)},
      ],
    });
    return TestBed.inject(AuthStateService);
  }

  it('uses the Danish date locale for a Danish user whose language row has id 3', () => {
    expect(serviceFor({locale: 'da', languageId: 3}).dateFnsLocale).toBe(customDaLocale);
  });

  it('uses the English date locale for an English user whose language row has id 6', () => {
    expect(serviceFor({locale: 'en-US', languageId: 6}).dateFnsLocale).toBe(enUS);
  });

  it('uses the German date locale for a German user whose language row has id 9', () => {
    expect(serviceFor({locale: 'de-DE', languageId: 9}).dateFnsLocale).toBe(de);
  });

  // updateUserLocale / updateCurrentUserLocaleAndDarkTheme store the region-less code.
  it('uses the German date locale when the stored locale is the shortened "de"', () => {
    expect(serviceFor({locale: 'de', languageId: 3}).dateFnsLocale).toBe(de);
  });

  it('uses the English date locale when the stored locale is the shortened "en"', () => {
    expect(serviceFor({locale: 'en', languageId: 2}).dateFnsLocale).toBe(enUS);
  });

  it('falls back to the language prefix for a regional code that is not an application locale', () => {
    expect(serviceFor({locale: 'de-AT', languageId: 9}).dateFnsLocale).toBe(de);
  });

  it('keeps a full regional code such as "pt-PT" as is', () => {
    expect(serviceFor({locale: 'pt-PT', languageId: 13}).dateFnsLocale).toBe(pt);
  });
});
