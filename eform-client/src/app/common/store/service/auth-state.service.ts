import { Injectable } from '@angular/core';
import { AuthStore } from '../store';
import { AuthQuery } from '../query';
import { AuthService, UserSettingsService } from 'src/app/common/services';
import {
  LoginRequestModel,
  UserClaimsModel,
  UserInfoModel,
} from 'src/app/common/models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { snakeToCamel } from 'src/app/common/helpers';
import { resetStores } from '@datorama/akita';
import { AppMenuStateService } from 'src/app/common/store';

@Injectable()
export class AuthStateService {
  private isRefreshing = false;
  constructor(
    private store: AuthStore,
    private service: AuthService,
    private query: AuthQuery,
    private router: Router,
    private userSettings: UserSettingsService,
    private appMenuStateService: AppMenuStateService
  ) {}

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
        this.userSettings.getUserSettings().subscribe((data) => {
          this.service.obtainUserClaims().subscribe((userClaims) => {
            this.store.update((state) => ({
              ...state,
              currentUser: {
                ...state.currentUser,
                darkTheme: data.model.darkTheme,
                locale: data.model.locale,
                loginRedirectUrl: data.model.loginRedirectUrl,
                claims: userClaims,
              },
            }));
            this.router
              .navigate([
                `/${
                  data.model.loginRedirectUrl
                    ? data.model.loginRedirectUrl
                    : '/'
                }`,
              ])
              .then();
          });
        });
        this.appMenuStateService.getAppMenu(false);
      }
      return;
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

  logout() {
    resetStores();
    this.router.navigate(['/auth']).then();
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

  get currentUserFullNameAsync(): Observable<string> {
    return this.query.selectFullName$;
  }

  get currentUserLocale(): string {
    return this.query.currentSetting.currentUser.locale;
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

  // get currentUserClaimsAsync() {
  //   return this.query.selectCurrentUserClaims$;
  // }

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
