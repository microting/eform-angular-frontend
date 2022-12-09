import {Injectable} from '@angular/core';
import {AuthStore} from '../store';
import {AuthQuery} from '../query';
import {
  AppSettingsService,
  AuthService,
  UserSettingsService
} from 'src/app/common/services';
import {
  LoginRequestModel,
  UserClaimsModel,
  UserInfoModel,
} from 'src/app/common/models';
import {Observable, take, zip} from 'rxjs';
import {Router} from '@angular/router';
import {snakeToCamel} from 'src/app/common/helpers';
import {resetStores} from '@datorama/akita';

@Injectable()
export class AuthStateService {
  private isRefreshing = false;

  constructor(
    private store: AuthStore,
    private service: AuthService,
    private query: AuthQuery,
    private router: Router,
    private userSettings: UserSettingsService,
    // private appSettingsStore: AppSettingsStore,
    public settingsService: AppSettingsService,
  ) {
  }

  isConnectionStringExistLoading = false;
  isUserSettingsLoading = false;

  login(loginInfo: LoginRequestModel) {
    this.service.login(loginInfo).subscribe((response) => {
      if (response) {
        this.store.update((state) => ({
          ...state,
          token: {
            accessToken: response.access_token,
            tokenType: response.token_type,
            expiresIn: response.expires_in,
            role: response.role,
          },
        }));
        this.getUserSettings();
      }
    });
  }

  refreshToken() {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.service.refreshToken().subscribe((response) => {
        if (response) {
          this.service.obtainUserClaims().subscribe((userClaims) => {
            this.store.update((state) => ({
              ...state,
              token: {
                accessToken: response.model.access_token,
                tokenType: response.model.token_type,
                expiresIn: response.model.expires_in,
                role: response.model.role,
              },
              currentUser: {
                ...state.currentUser,
                claims: userClaims,
              },
            }));
            this.isRefreshing = false;
          });
        }
      });
    }
  }

  getUserSettings() {
    if (!this.isUserSettingsLoading) {
      this.isUserSettingsLoading = true;
      zip(this.userSettings.getUserSettings(), this.service.obtainUserClaims()).subscribe(([userSettings, userClaims]) => {
        this.isUserSettingsLoading = false;
        this.store.update((state) => ({
          ...state,
          currentUser: {
            ...state.currentUser,
            darkTheme: userSettings.model.darkTheme,
            locale: userSettings.model.locale,
            loginRedirectUrl: userSettings.model.loginRedirectUrl,
            claims: userClaims,
          },
        }));
        if (userSettings.model.loginRedirectUrl) {
          this.router
            .navigate([
              `/${userSettings.model.loginRedirectUrl}`,
            ]).then();
        }
      });
    }
  }

  logout() {
    resetStores();
    this.router.navigate(['/auth']).then();
  }

  isConnectionStringExist() {
    console.debug('isConnectionStringExist called');
    if (!this.isConnectionStringExistLoading) {
      this.isConnectionStringExistLoading = true;
      this.settingsService.connectionStringExist().pipe(take(1)).subscribe(
        (result) => {
          if (!result || (result && !result.success)) {
            this.store._setState(state => ({...state, isConnectionStringExist: false}));
            this.isConnectionStringExistLoading = false;
          } else if (result && result.success) {
            this.store.update(() => ({isConnectionStringExist: true}));
            this.isConnectionStringExistLoading = false;
          }
        }
      );
    }
  }

  get isConnectionStringExistAsync(): Observable<boolean> {
    return this.query.selectIsConnectionStringExist$;
  }

  get isAuth(): boolean {
    return !!this.query.currentSetting.token.accessToken;
  }

  get isAuthAsync(): Observable<boolean> {
    return this.query.selectIsAuth$;
  }

  get bearerToken(): string {
    return 'Bearer ' + this.query.currentSetting.token.accessToken;
  }

  get isAdmin(): boolean {
    return this.query.currentSetting.token.role === 'admin';
  }

  get currentRole(): string {
    return this.query.currentSetting.token.role;
  }

  get isDarkThemeAsync(): Observable<boolean> {
    return this.query.selectDarkTheme$;
  }

  get currentUserFullName(): string {
    return `${this.query.currentSetting.currentUser.firstName} ${this.query.currentSetting.currentUser.lastName}`;
  }

  get currentUserName(): string {
    return this.query.currentSetting.currentUser.userName;
  }

  get currentUserFullNameAsync(): Observable<string> {
    return this.query.selectFullName$;
  }

  get currentUserLocale(): string {
    return this.query.currentSetting.currentUser.locale;
  }

  get currentUserLocaleAsync() {
    return this.query.selectCurrentUserLocale$;
  }

  updateUserLocale(locale: string) {
    this.store.update((state) => ({
      ...state,
      currentUser: {
        ...state.currentUser,
        locale: locale,
      },
    }));
  }

  updateCurrentUserLocaleAndDarkTheme(locale: string, darkTheme: boolean) {
    this.store.update((state) => ({
      ...state,
      currentUser: {
        ...state.currentUser,
        locale: locale,
        darkTheme: darkTheme,
      },
    }));
  }

  updateDarkTheme(darkTheme: boolean) {
    this.store.update((state) => ({
      ...state,
      currentUser: {
        ...state.currentUser,
        darkTheme: darkTheme,
      },
    }));
  }

  updateUserInfo(userInfo: UserInfoModel) {
    this.store.update((state) => ({
      ...state,
      currentUser: {
        ...state.currentUser,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        id: userInfo.id,
        userName: userInfo.email,
      },
    }));
  }

  get currentUserClaimsAsync() {
    return this.query.selectCurrentUserClaims$;
  }

  get currentUserClaims(): UserClaimsModel {
    return this.query.currentSetting.currentUser.claims;
  }

  // updateUserClaims(userClaims: UserClaimsModel) {
  //   this.store.update((state) => ({
  //     currentUser: {
  //       ...state.currentUser,
  //       claims: userClaims,
  //     },
  //   }));
  // }

  checkClaim(claimName: string): boolean {
    const userClaims = this.currentUserClaims;
    const normalizedClaimName = snakeToCamel(claimName);
    return (
      userClaims.hasOwnProperty(normalizedClaimName) &&
      userClaims[normalizedClaimName] === 'True'
    );
  }

  get loginRedirectUrl(): string {
    return this.query.currentSetting.currentUser.loginRedirectUrl;
  }
}
