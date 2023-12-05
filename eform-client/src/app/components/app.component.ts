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
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // eslint-disable-next-line no-console
        console.log('NavigationStart', event);
        if (event.id === 1) {
          if (event.url.includes('auth')) {
            // eslint-disable-next-line no-console
            console.log('NavigationStart - auth');
            // this.authStore.dispatch({type: '[Auth] Logout'});
            // this.router.navigate(['/auth']).then();
          } else {
            const accessToken = JSON.parse(localStorage.getItem('token'));
            if (accessToken === null) {
              // eslint-disable-next-line no-console
              console.log('NavigationStart - accessToken === null');
              this.router.navigate(['/auth']).then();
            } else {
              // eslint-disable-next-line no-console
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
                  zip(this.userSettings.getUserSettings(), this.service.obtainUserClaims())
                    .subscribe(([userSettings, userClaims]) => {
                      if (userClaims === null) {
                        debugger;
                        localStorage.removeItem('token');
                        this.router.navigate(['/auth']).then();
                      } else {
                        //this.isUserSettingsLoading = false;
                        // eslint-disable-next-line no-console
                        console.log('AppComponent - constructor - zip - userSettings', userSettings);
                        // eslint-disable-next-line no-console
                        console.log('AppComponent - constructor - zip - userClaims', userClaims);
                        this.authStore.dispatch({
                          type: '[Auth] Update User Info',
                          payload: {userSettings: userSettings, userClaims: userClaims}
                        })
                        this.authStateService.setLocale();
                        this.translateService.use(userSettings.model.locale);
                        //this.router.navigate(event.url.split('/')).then();}
                      }
                  });
                }
              });
            }
          }
        }
      }
    });
    // eslint-disable-next-line no-console
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
