import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AppSettingsService, AuthService, TitleService, UserSettingsService} from 'src/app/common/services';
import {NavigationStart, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription, take, zip} from 'rxjs';
import {
  selectAuthIsAuth,
  selectConnectionStringExists,
  selectCurrentUserLocale,
  selectIsDarkMode, selectSideMenuOpened
} from 'src/app/state/auth/auth.selector';
import {AuthStateService} from 'src/app/common/store';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public selectIsAuth$ = this.authStore.select(selectAuthIsAuth);
  constructor(
    private router: Router,
    private authStore: Store,
    private userSettings: UserSettingsService,
    private settingsService: AppSettingsService,
    public authStateService: AuthStateService,
    private service: AuthService,
    private translateService: TranslateService,
    ngTitle: Title,
    titleService: TitleService,
  ) {
    // http://localhost:4200/auth/restore-password-confirmation?userId=1&code=CfDJ8ChPLcxuk45Lmzyewz%2fSttc6c0L9YlEIhf5rQgNonMpYQwaWr4Q%2bzHRh4c8dBOFBY41MmehxKE%2bdDPS%2fkMu07yrt536Egt%2f3McuMwqMOa3YXCixKfxrJGroJ%2bXSoSQJCmVps14kD02qv4H5%2b3AvOCxBHSi7u4B7lU4QfxR4OIeV6%2fCpjBCn1Ea%2fU%2bPufy5g%2bAA%3d%3d
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('NavigationStart', event);
        if (event.id === 1) {
          if (event.url.includes('auth')) {
            console.log('NavigationStart - auth');
            // this.authStore.dispatch({type: '[Auth] Logout'});
            // this.router.navigate(['/auth']).then();
          } else {
            const accessToken = JSON.parse(localStorage.getItem('token'));
            if (accessToken === null) {
              console.log('NavigationStart - accessToken === null');
              this.router.navigate(['/auth']).then();
            } else {
              console.log('NavigationStart - accessToken !== null');
              const accessTokenString = accessToken.token.accessToken;
              const accessTokenRole = accessToken.token.role;
              const accessTokenId = accessToken.token.id;
              this.authStore.dispatch({
                type: '[Auth] Refresh Token', payload: {
                  token:
                    {
                      accessToken: accessTokenString,
                      tokenType: null,
                      expiresIn: null,
                      role: accessTokenRole,
                      id: accessTokenId
                    }
                }
              });
              this.selectIsAuth$.pipe(take(1)).subscribe((isAuth) => {
                if (isAuth) {
                  zip(this.userSettings.getUserSettings(), this.service.obtainUserClaims()).subscribe(([userSettings, userClaims]) => {
                    //this.isUserSettingsLoading = false;
                    this.authStore.dispatch({
                      type: '[Auth] Update User Info',
                      payload: {userSettings: userSettings, userClaims: userClaims}
                    })
                    this.authStateService.setLocale();
                    this.translateService.use(userSettings.model.locale);
                    this.router.navigate(event.url.split('/')).then();
                  });
                }
              });
            }
          }
        }
      }
    });
    console.log('AppComponent - constructor');
    const defaultTitle = 'eForm Backend';
    titleService.title.subscribe(title => {
      if(title && title !== defaultTitle) {
        ngTitle.setTitle(`${title} - ${defaultTitle}`)
      } else {
        ngTitle.setTitle(defaultTitle)
      }
    });
  }
}
