import {Inject, Injectable} from '@angular/core';
import {AppSettingsService, AuthService, LocaleService, UserSettingsService} from 'src/app/common/services';
import {AuthResponseModel, LoginRequestModel, OperationDataResult, UserClaimsModel, UserInfoModel,} from 'src/app/common/models';
import {BehaviorSubject, catchError, of, switchMap, take, zip} from 'rxjs';
import {Router} from '@angular/router';
import {Locale} from 'date-fns';
import {customDaLocale} from 'src/app/common/const';
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
  logout,
  updateSideMenuOpened,
  updateUserInfo
} from 'src/app/state';
import {snakeToCamel} from 'src/app/common/helpers';
import {filter, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthStateService {
  private isRefreshing = false;
  private currentLanguageId = 1;
  private claims: UserClaimsModel;

  constructor(
    private service: AuthService,
    private translateService: TranslateService,
    private localeService: LocaleService,
    private router: Router,
    private authStore: Store,
    private userSettings: UserSettingsService,
    public settingsService: AppSettingsService,
    @Inject(MAT_DATE_LOCALE) private dateLocale: BehaviorSubject<string | Locale | null>
  ) {
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
        }),
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
        })
      )
      .subscribe();
  }

  // initLocale() {
  //   const arrayTranslate = [];
  //   // eslint-disable-next-line guard-for-in
  //   for (const translate in translates) {
  //     arrayTranslate.push(translate);
  //   }
  //   this.translateService.addLangs(arrayTranslate);
  //   let language = '';
  //   this.selectCurrentUserLocale$.subscribe((data) => {
  //     language = data;
  //   });
  //   this.translateService.setDefaultLang(applicationLanguages[1].locale);
  //   if (!language) {
  //     //this.authStateService.updateUserLocale(applicationLanguages[1].locale);
  //     this.selectCurrentUserLocale$.subscribe((data) => {
  //       language = data;
  //       //this.authStateService.updateUserLocale(language);
  //       this.translateService.use(language);
  //       // Set cookies
  //       //this.initCookies(language);
  //     });
  //   } else {
  //     this.translateService.use(language);
  //     //this.initCookies(language);
  //   }
  //   this.selectCurrentUserLocale$
  //     .pipe(filter(x => !!x))
  //     .subscribe(x => {
  //       this.translateService.use(x);
  //       //this.updateCookies(x);
  //     });
  // }

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
    )
  }

  // getUserSettings() {
  //   if (!this.isUserSettingsLoading) {
  //   // TODO: need to fix this
  //   this.isUserSettingsLoading = true;
  //   zip(this.userSettings.getUserSettings(), this.service.obtainUserClaims()).subscribe(([userSettings, userClaims]) => {
  //     this.isUserSettingsLoading = false;
  //     this.authStore.dispatch({type: '[Auth] Update User Info', payload: {userSettings: userSettings, userClaims: userClaims}})
  //   //   // console.log(`before AuthStateService.getUserSettings.store.update \n ${JSON.stringify(this.store._value())}`);
  //   //   this.store.update((state) => ({
  //   //     ...state,
  //   //     currentUser: {
  //   //       ...state.currentUser,
  //   //       darkTheme: userSettings.model.darkTheme,
  //   //       locale: userSettings.model.locale,
  //   //       loginRedirectUrl: userSettings.model.loginRedirectUrl,
  //   //       claims: userClaims,
  //   //     },
  //   //   }));
  //     this.setLocale();
  //   //   // console.log(`after AuthStateService.getUserSettings.store.update \n ${JSON.stringify(this.store._value())}`);
  //
  //     // this.authStore.dispatch({type: '[AppMenu] Load AppMenu'});
  //     if (userSettings.model.loginRedirectUrl != null) {
  //       debugger;
  //       this.router
  //         .navigate([
  //           `/${userSettings.model.loginRedirectUrl}`,
  //         ]).then();
  //     } else {
  //       this.router
  //         .navigate(['/']).then();
  //     }
  //   });
  //   }
  // }

  logout() {
    this.authStore.dispatch(logout());
    this.router.navigate(['/auth']).then();
  }

  isConnectionStringExist() {
    console.debug('isConnectionStringExist called');
    // TODO: need to fix this
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
    // TODO: need to fix this
    // this.store.update((state) => ({
    //   ...state,
    //   currentUser: {
    //     ...state.currentUser,
    //     locale: locale,
    //   },
    // }));
    // this.setLocale();
  }

  updateCurrentUserLocaleAndDarkTheme(locale: string, darkTheme: boolean) {
    // TODO: need to fix this
    // this.store.update((state) => ({
    //   ...state,
    //   currentUser: {
    //     ...state.currentUser,
    //     locale: locale,
    //     darkTheme: darkTheme,
    //   },
    // }));
    // this.setLocale();
  }

  updateDarkTheme(darkTheme: boolean) {
    // TODO: need to fix this
    // this.store.update((state) => ({
    //   ...state,
    //   currentUser: {
    //     ...state.currentUser,
    //     darkTheme: darkTheme,
    //   },
    // }));
  }

  updateUserInfo(userInfo: UserInfoModel) {
    // TODO: need to fix this
    // this.store.update((state) => ({
    //   ...state,
    //   currentUser: {
    //     ...state.currentUser,
    //     firstName: userInfo.firstName,
    //     lastName: userInfo.lastName,
    //     id: userInfo.id,
    //     userName: userInfo.email,
    //   },
    // }));
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
}
