import {Inject, Injectable} from '@angular/core';
import {AppSettingsService, AuthService, LocaleService, UserSettingsService} from 'src/app/common/services';
import {AuthResponseModel, LoginRequestModel, OperationDataResult, UserClaimsModel, UserInfoModel,} from 'src/app/common/models';
import {BehaviorSubject, catchError, of, switchMap, take, zip} from 'rxjs';
import {Router} from '@angular/router';
import {Locale} from 'date-fns';
import {applicationLanguages, customDaLocale} from 'src/app/common/const';
import {de, enUS, es, fr, it, nb, nl, pl, sv, uk, ptBR, pt, fi} from 'date-fns/locale';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {Store} from '@ngrx/store';
import {
  selectAuthIsAuth,
  selectConnectionStringExists, selectCurrentUserClaims,
  selectCurrentUserLanguageId,
  selectCurrentUserLocale
} from 'src/app/state/auth/auth.selector';
import {TranslateService} from '@ngx-translate/core';
import {
  connectionStringExistCount,
  loadAuthFailure,
  loadAuthSuccess,
  logout, updateCurrentUserLocaleAndDarkTheme, updateDarkTheme,
  updateSideMenuOpened,
  updateUserInfo, updateUserLocale
} from 'src/app/state';
import {snakeToCamel} from 'src/app/common/helpers';
import {filter, tap} from 'rxjs/operators';
import {translates} from 'src/assets/i18n/translates';
import {Platform} from '@angular/cdk/platform';

@Injectable({providedIn: 'root'})
export class AuthStateService {
  private isRefreshing = false;
  private currentLanguageId = 1;
  private claims: UserClaimsModel;
  private localeIsInited = false;
  private defaultLocale = applicationLanguages[1];
  platformInfo: string;

  constructor(
    private platform: Platform,
    private service: AuthService,
    private translateService: TranslateService,
    private localeService: LocaleService,
    private router: Router,
    private authStore: Store,
    private userSettings: UserSettingsService,
    public settingsService: AppSettingsService,
    @Inject(MAT_DATE_LOCALE) private dateLocale: BehaviorSubject<string | Locale | null>
  ) {
    this.platformInfo = this.getPlatformInfo();
    this.selectCurrentUserLanguageId$.subscribe((languageId) => this.currentLanguageId = languageId);
    this.selectCurrentUserClaims$.subscribe((claims) => this.claims = claims);
  }

  isConnectionStringExistLoading = false;

  private selectIsAuth$ = this.authStore.select(selectAuthIsAuth);
  private selectConnectionStringExists$ = this.authStore.select(selectConnectionStringExists);
  private selectCurrentUserLocale$ = this.authStore.select(selectCurrentUserLocale);
  private selectCurrentUserLanguageId$ = this.authStore.select(selectCurrentUserLanguageId);
  private selectCurrentUserClaims$ = this.authStore.select(selectCurrentUserClaims);

  login(loginInfo: LoginRequestModel) {
    this.service.login(loginInfo)
      .pipe(
        filter(x => !!x),
        tap((response) => {
          this.authStore.dispatch(loadAuthSuccess({
              token: {
                accessToken: response.accessToken,
                tokenType: response.tokenType,
                expiresIn: response.expiresIn,
                role: response.role
              },
              currentUser: {firstName: response.firstName, lastName: response.lastName, userName: response.userName, id: response.id},
              count: 2
            })
          );
          this.authStore.dispatch(updateSideMenuOpened({sideMenuIsOpened: !this.isMobilePlatform()}));
          this.selectIsAuth$.pipe( // run after update auth info in store
            filter(x => x === true),
            take(1),
            tap(() => {
              zip(this.userSettings.getUserSettings(), this.service.obtainUserClaims())
                .pipe(
                  take(1),
                  tap(([userSettings, userClaims]) => {
                    if (userClaims === null) {
                      this.logout();
                    } else {
                      this.authStore.dispatch(updateUserInfo({userSettings: userSettings, userClaims: userClaims}));
                      this.translateService.use(userSettings.model.locale);
                      this.localeService.initCookies(userSettings.model.locale);
                      if (userSettings.model.loginRedirectUrl != null) {
                        this.router
                          .navigate([
                            `/${userSettings.model.loginRedirectUrl}`,
                          ]).then();
                      } else {
                        this.router
                          .navigate(['/']).then();
                      }
                    }
                  }),
                )
                .subscribe();
            }),
          ).subscribe();
        }),
        take(1),
      )
      .subscribe();
  }

  initLocale() {
    if (!this.localeIsInited) {
      this.localeIsInited = true;
      const arrayTranslate = Object.keys(translates);
      this.translateService.addLangs(arrayTranslate);
      arrayTranslate.forEach(translateName => {
        this.translateService.setTranslation(translateName, translates[translateName], true);
      })
      this.translateService.setDefaultLang(this.defaultLocale.locale);
      const enLocale = applicationLanguages[1].locale;
      this.updateUserLocale(enLocale);
      this.translateService.use(enLocale);
      this.selectCurrentUserLocale$
        .pipe(filter(x => !!x))
        .subscribe(x => {
          this.translateService.use(x);
          this.setLocale();
          //this.updateCookies(x);
        });
    }
  }

  refreshToken() {
    return this.service.refreshToken().pipe(
      tap((auth: OperationDataResult<AuthResponseModel>) => (this.authStore.dispatch(loadAuthSuccess({
        token: {
          accessToken: auth.model.accessToken,
          tokenType: auth.model.tokenType,
          role: auth.model.role,
          expiresIn: auth.model.expiresIn,
        },
        currentUser: {
          id: auth.model.id,
          userName: auth.model.userName,
          firstName: auth.model.firstName,
          lastName: auth.model.lastName,
        },
        count: 2,
      })))),
      switchMap((response) => {
        if (response && response.success && response.model) {
          zip(this.userSettings.getUserSettings(), this.service.obtainUserClaims())
            .pipe(take(1))
            .subscribe(([userSettings, userClaims]) => {
              this.authStore.dispatch(updateUserInfo({userSettings: userSettings, userClaims: userClaims}));
              this.isRefreshing = false;
            });
          return of(response);
        } else {
          this.logout();
          this.isRefreshing = false;
          return of(null);
        }
      }),
      catchError((error: any) => {
        this.logout();
        this.isRefreshing = false;
        return of(loadAuthFailure(error));
      }),
    );
  }

  logout() {
    this.authStore.dispatch(logout());
    let userLocale: string = this.defaultLocale.locale;
    try {
      userLocale = navigator.language || navigator.languages[0];
    } catch (e) {
      console.error('Error in logout: ', e);
    }
    this.updateCurrentUserLocaleAndDarkTheme(userLocale, false); // update locale to default locale and theme
    this.router.navigate(['/auth']).then();
  }

  isConnectionStringExist() {
    console.debug('isConnectionStringExist called');
    if (!this.isConnectionStringExistLoading) {
      this.isConnectionStringExistLoading = true;
      this.settingsService.connectionStringExist().pipe(take(1)).subscribe(
        (result) => {
          if (!result || (result && !result.success)) {
            this.authStore.dispatch(connectionStringExistCount({count: 2, isConnectionStringExist: false}));
            this.isConnectionStringExistLoading = false;
          } else if (result && result.success) {
            this.authStore.dispatch(connectionStringExistCount({count: 2, isConnectionStringExist: true}));
            this.isConnectionStringExistLoading = false;
          }
        }
      );
    }
  }

  updateUserLocale(locale: string) {
    try {
      if (locale.includes('-')) {
        locale = locale.split('-')[0];
      }
      const languageId = applicationLanguages.find(x => x.locale.split('-')[0] === locale).id;
      this.authStore.dispatch(updateUserLocale({locale: locale, languageId: languageId}));
    } catch (e) {
      console.error('Error in updateUserLocale: ', e);
      const languageId = applicationLanguages.find(x => x.locale === 'en-US').id;
      this.authStore.dispatch(updateUserLocale({locale: locale, languageId: languageId}));
    }
  }

  updateCurrentUserLocaleAndDarkTheme(locale: string, darkTheme: boolean) {
    try {
      if (locale.includes('-')) {
        locale = locale.split('-')[0];
      }
      const languageId = applicationLanguages.find(x => x.locale.split('-')[0] === locale).id;
      this.authStore.dispatch(updateCurrentUserLocaleAndDarkTheme({locale: locale, languageId: languageId, darkTheme: darkTheme}));
    } catch (e) {
      console.error('Error in updateUserLocale: ', e);
      const languageId = applicationLanguages.find(x => x.locale === 'en-US').id;
      this.authStore.dispatch(updateCurrentUserLocaleAndDarkTheme({locale: locale, languageId: languageId, darkTheme: darkTheme}));
    }
  }

  updateDarkTheme(darkTheme: boolean) {
    this.authStore.dispatch(updateDarkTheme(darkTheme));
  }

  updateSideMenuOpened(opened: boolean) {
    this.authStore.dispatch(updateSideMenuOpened({sideMenuIsOpened: opened}));
  }

  checkClaim(claimName: string): boolean {
    const userClaims = this.claims;
    const normalizedClaimName = snakeToCamel(claimName);
    return (
      userClaims.hasOwnProperty(normalizedClaimName) &&
      userClaims[normalizedClaimName] === 'True'
    );
  }

  public setLocale() {
    this.dateLocale.next(this.dateFnsLocale);
  }

  get dateFnsLocale(): Locale {
    switch (this.currentLanguageId) {
      case 1: {
        return customDaLocale;
      }
      case 2: {
        return enUS;
      }
      case 3: {
        return de;
      }
      case 4: {
        return uk;
      }
      case 5: {
        return pl;
      }
      case 6: {
        return nb; // it's (Bokmål) maybe need nn (Nynorsk)
      }
      case 7: {
        return sv;
      }
      case 8: {
        return es;
      }
      case 9: {
        return fr;
      }
      case 10: {
        return it;
      }
      case 11: {
        return nl;
      }
      case 12: {
        return ptBR;
      }
      case 13: {
        return pt;
      }
      case 14: {
        return fi;
      }
      default: {
        return enUS;
      }
    }
  }

  getPlatformInfo(): string {
    if (this.platform.ANDROID) {
      return 'Android';
    } else if (this.platform.IOS) {
      return 'iOS';
    } else if (this.platform.isBrowser) {
      return this.getDesktopPlatform();
    } else {
      return 'Unknown platform';
    }
  }

  private getDesktopPlatform(): string {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes('Win')) {
      return 'Windows';
    } else if (userAgent.includes('Mac')) {
      return 'macOS';
    } else if (userAgent.includes('Linux')) {
      return 'Linux';
    } else {
      return 'Unknown desktop platform';
    }
  }

  private isMobilePlatform(): boolean {
    return this.platform.ANDROID || this.platform.IOS;
  }
}
