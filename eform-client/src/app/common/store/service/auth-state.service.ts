import {Inject, Injectable} from '@angular/core';
import {AppSettingsService, AuthService, UserSettingsService} from 'src/app/common/services';
import {LoginRequestModel, UserClaimsModel, UserInfoModel,} from 'src/app/common/models';
import {BehaviorSubject, Observable, Subscription, take, zip} from 'rxjs';
import {Router} from '@angular/router';
import {snakeToCamel} from 'src/app/common/helpers';
import {resetStores} from '@datorama/akita';
import {Locale} from 'date-fns';
import {applicationLanguages, customDaLocale} from 'src/app/common/const';
import {de, enUS, es, fr, it, nb, nl, pl, sv, uk, ptBR, pt, fi} from 'date-fns/locale';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {Store} from '@ngrx/store';
import {selectAuthIsAuth, selectConnectionStringExists, selectCurrentUserLocale} from 'src/app/state/auth/auth.selector';
import {TranslateService} from '@ngx-translate/core';
import {translates} from 'src/assets/i18n/translates';
import {filter} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthStateService {
  private isRefreshing = false;

  constructor(
    //private store: AuthStore,
    private service: AuthService,
    //private query: AuthQuery,
    private translateService: TranslateService,
    private router: Router,
    private authStore: Store,
    private userSettings: UserSettingsService,
    // private appSettingsStore: AppSettingsStore,
    public settingsService: AppSettingsService,
    @Inject(MAT_DATE_LOCALE) private  dateLocale: BehaviorSubject<string | Locale | null>
  ) {
  }

  isConnectionStringExistLoading = false;
  isUserSettingsLoading = false;

  private selectIsAuth$ = this.authStore.select(selectAuthIsAuth);
  private selectConnectionStringExists$ = this.authStore.select(selectConnectionStringExists);
  private selectCurrentUserLocale$ = this.authStore.select(selectCurrentUserLocale);

  login(loginInfo: LoginRequestModel) {
    // this.authStore.dispatch({type: '[Auth] Authenticate', payload: loginInfo});
    // TODO: need to fix this
    // this.store = new AuthStore();
    this.service.login(loginInfo).subscribe((response) => {
      if (response) {
        this.authStore.dispatch({type: '[Auth] Authenticate Success', payload:
          // eslint-disable-next-line max-len
            {token: {accessToken: response.access_token, tokenType: response.token_type, expiresIn: response.expires_in, role: response.role, id: response.id},
            currentUser: {firstName: response.firstName, lastName: response.lastName, userName: response.userName},
            count: 2}
        });
        // save the same token into local storage
        localStorage.setItem('token',
          JSON.stringify({
            token: {
              accessToken:response.access_token,
              tokenType: response.token_type,
              expiresIn: response.expires_in,
              role: response.role,
              id: response.id}
          }));
        zip(this.userSettings.getUserSettings(), this.service.obtainUserClaims()).subscribe(([userSettings, userClaims]) => {
          this.isUserSettingsLoading = false;
          this.authStore.dispatch({type: '[Auth] Update User Info', payload: {userSettings: userSettings, userClaims: userClaims}})
          //   // console.log(`before AuthStateService.getUserSettings.store.update \n ${JSON.stringify(this.store._value())}`);
          //   this.store.update((state) => ({
          //     ...state,
          //     currentUser: {
          //       ...state.currentUser,
          //       darkTheme: userSettings.model.darkTheme,
          //       locale: userSettings.model.locale,
          //       loginRedirectUrl: userSettings.model.loginRedirectUrl,
          //       claims: userClaims,
          //     },
          //   }));
          //   this.setLocale();
          //   // console.log(`after AuthStateService.getUserSettings.store.update \n ${JSON.stringify(this.store._value())}`);
          this.translateService.use(userSettings.model.locale);
          // this.authStore.dispatch({type: '[AppMenu] Load AppMenu'});
          if (userSettings.model.loginRedirectUrl != null) {
            this.router
              .navigate([
                `/${userSettings.model.loginRedirectUrl}`,
              ]).then();
          } else {
            this.router
              .navigate(['/']).then();
          }
        });
        //this.getUserSettings();
      }
    });
  }

  initLocale() {
    const arrayTranslate = [];
    // eslint-disable-next-line guard-for-in
    for (const translate in translates) {
      arrayTranslate.push(translate);
    }
    this.translateService.addLangs(arrayTranslate);
    let language = '';
    this.selectCurrentUserLocale$.subscribe((data) => {
      language = data;
    });
    this.translateService.setDefaultLang(applicationLanguages[1].locale);
    if (!language) {
      //this.authStateService.updateUserLocale(applicationLanguages[1].locale);
      this.selectCurrentUserLocale$.subscribe((data) => {
        language = data;
        //this.authStateService.updateUserLocale(language);
        this.translateService.use(language);
        // Set cookies
        //this.initCookies(language);
      });
    } else {
      this.translateService.use(language);
      //this.initCookies(language);
    }
    this.selectCurrentUserLocale$
      .pipe(filter(x => !!x))
      .subscribe(x => {
        this.translateService.use(x);
        //this.updateCookies(x);
      });
  }

  refreshToken() {
    this.authStore.dispatch({type: '[Auth] Refresh Token'});
    // TODO need to fix this
    // if (!this.isRefreshing) {
    //   this.isRefreshing = true;
    //   this.service.refreshToken().subscribe((response) => {
    //     if (response) {
    //       this.service.obtainUserClaims().subscribe((userClaims) => {
    //         // console.log(`before AuthStateService.refreshToken.store.update \n ${JSON.stringify(this.store._value())}`);
    //         this.store.update((state) => ({
    //           ...state,
    //           token: {
    //             accessToken: response.model.access_token,
    //             tokenType: response.model.token_type,
    //             expiresIn: response.model.expires_in,
    //             role: response.model.role,
    //           },
    //           currentUser: {
    //             ...state.currentUser,
    //             claims: userClaims,
    //           },
    //         }));
    //         // console.log(`after AuthStateService.refreshToken.store.update \n ${JSON.stringify(this.store._value())}`);
    //         this.isRefreshing = false;
    //       });
    //     } else {
    //       this.logout();
    //       this.isRefreshing = false;
    //     }
    //   });
    // }
  }

  getUserSettings() {
    if (!this.isUserSettingsLoading) {
    // TODO: need to fix this
    this.isUserSettingsLoading = true;
    zip(this.userSettings.getUserSettings(), this.service.obtainUserClaims()).subscribe(([userSettings, userClaims]) => {
      this.isUserSettingsLoading = false;
      this.authStore.dispatch({type: '[Auth] Update User Info', payload: {userSettings: userSettings, userClaims: userClaims}})
    //   // console.log(`before AuthStateService.getUserSettings.store.update \n ${JSON.stringify(this.store._value())}`);
    //   this.store.update((state) => ({
    //     ...state,
    //     currentUser: {
    //       ...state.currentUser,
    //       darkTheme: userSettings.model.darkTheme,
    //       locale: userSettings.model.locale,
    //       loginRedirectUrl: userSettings.model.loginRedirectUrl,
    //       claims: userClaims,
    //     },
    //   }));
    //   this.setLocale();
    //   // console.log(`after AuthStateService.getUserSettings.store.update \n ${JSON.stringify(this.store._value())}`);

      // this.authStore.dispatch({type: '[AppMenu] Load AppMenu'});
      if (userSettings.model.loginRedirectUrl != null) {
        this.router
          .navigate([
            `/${userSettings.model.loginRedirectUrl}`,
          ]).then();
      } else {
        this.router
          .navigate(['/']).then();
      }
    });
    }
  }

  logout() {
    // console.log(`before AuthStateService.logout \n ${JSON.stringify(this.store._value())}`);
    localStorage.removeItem('token');
    resetStores();
    this.router.navigate(['/auth']).then();
    // console.log(`after AuthStateService.logout \n ${JSON.stringify(this.store._value())}`);
  }

  isConnectionStringExist() {
    console.debug('isConnectionStringExist called');
    // TODO: need to fix this
    if (!this.isConnectionStringExistLoading) {
       this.isConnectionStringExistLoading = true;
       this.settingsService.connectionStringExist().pipe(take(1)).subscribe(
         (result) => {
           if (!result || (result && !result.success)) {
             this.authStore.dispatch({type: '[Auth] Connection String Exist Count', payload: {count: 2, isConnectionStringExist: false}});
             this.isConnectionStringExistLoading = false;
           } else if (result && result.success) {
             this.authStore.dispatch({type: '[Auth] Connection String Exist Count', payload: {count: 2, isConnectionStringExist: true}});
             this.isConnectionStringExistLoading = false;
           }
         }
       );
     }
  }

  // get isConnectionStringExistAsync(): Observable<boolean> {
  //   return this.query.selectIsConnectionStringExist$;
  // }
  //
  // get IsConnectionStringExistWithCountAsync() {
  //   return this.query.selectIsConnectionStringExistWithCount$;
  // }

  // get isAuth(): boolean {
  //   this.selectIsAuth$.subscribe((isAuth: boolean) => {
  //     return isAuth;
  //   });
  //   //return !!this.query.currentSetting.token.accessToken;
  // }

  // get isAuthAsync(): Observable<boolean> {
  //   return this.selectIsAuth$;
  // }
  //
  // get bearerToken(): string {
  //   return 'Bearer ' + this.query.currentSetting.token.accessToken;
  // }
  //
  // get isAdmin(): boolean {
  //   return this.query.currentSetting.token.role === 'admin';
  // }
  //
  // get currentRole(): string {
  //   return this.query.currentSetting.token.role;
  // }
  //
  // get isDarkThemeAsync(): Observable<boolean> {
  //   return this.query.selectDarkTheme$;
  // }
  //
  // get currentUserFullName(): string {
  //   return `${this.query.currentSetting.currentUser.firstName} ${this.query.currentSetting.currentUser.lastName}`;
  // }
  //
  // get currentUserName(): string {
  //   return this.query.currentSetting.currentUser.userName;
  // }
  //
  // get currentUserFullNameAsync(): Observable<string> {
  //   return this.query.selectFullName$;
  // }
  //
  // get currentUserLocale(): string {
  //   return this.query.currentSetting.currentUser.locale;
  // }
  //
  // get currentUserLanguage(): { id: number; locale: string; text: string } {
  //   return applicationLanguages.find(x => x.locale === this.query.currentSetting.currentUser.locale);
  // }
  //
  // get currentUserLanguageAsync(): Observable<{ id: number, locale: string, text: string }> {
  //   return this.query.selectCurrentUserLanguage$;
  // }
  //
  // get currentUserLocaleAsync() {
  //   return this.query.selectCurrentUserLocale$;
  // }
  //
  // get sideMenuOpenedAsync() {
  //   return this.query.selectSideMenuOpened$;
  // }

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
    // TODO: need to fix this
    // this.store.update((state) => ({
    //   ...state,
    //   sideMenuOpened: opened,
    // }));
  }

  // get currentUserClaimsAsync() {
  //   return this.query.selectCurrentUserClaims$;
  // }
  //
  // get currentUserClaims(): UserClaimsModel {
  //   return this.query.currentSetting.currentUser.claims;
  // }

  // updateUserClaims(userClaims: UserClaimsModel) {
  //   this.store.update((state) => ({
  //     currentUser: {
  //       ...state.currentUser,
  //       claims: userClaims,
  //     },
  //   }));
  // }

  // checkClaim(claimName: string): boolean {
  //   const userClaims = this.currentUserClaims;
  //   const normalizedClaimName = snakeToCamel(claimName);
  //   return (
  //     userClaims.hasOwnProperty(normalizedClaimName) &&
  //     userClaims[normalizedClaimName] === 'True'
  //   );
  // }

  // get loginRedirectUrl(): string {
  //   return this.query.currentSetting.currentUser.loginRedirectUrl;
  // }

  // private setLocale() {
  //   this.dateLocale.next(this.dateFnsLocale);
  // }
  //
  // get dateFnsLocale(): Locale {
  //   const currentLanguage = this.currentUserLanguage;
  //   switch (currentLanguage.id) {
  //     case 1: {
  //       return customDaLocale;
  //     }
  //     case 2: {
  //       return enUS;
  //     }
  //     case 3: {
  //       return de;
  //     }
  //     case 4: {
  //       return uk;
  //     }
  //     case 5: {
  //       return pl;
  //     }
  //     case 6: {
  //       return nb; // it's (Bokmål) maybe need nn (Nynorsk)
  //     }
  //     case 7: {
  //       return sv;
  //     }
  //     case 8: {
  //       return es;
  //     }
  //     case 9: {
  //       return fr;
  //     }
  //     case 10: {
  //       return it;
  //     }
  //     case 11: {
  //       return nl;
  //     }
  //     case 12: {
  //       return ptBR;
  //     }
  //     case 13: {
  //       return pt;
  //     }
  //     case 14: {
  //       return fi;
  //     }
  //     default: {
  //       return enUS;
  //     }
  //   }
  // }
}
