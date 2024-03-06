import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AuthService, TitleService, UserSettingsService} from 'src/app/common/services';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {take, zip, debounceTime} from 'rxjs';
import {
  selectAuthIsAuth,
  AuthSyncStorageService,
  updateUserInfo,
} from 'src/app/state';
import {AuthStateService} from 'src/app/common/store';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  public selectIsAuth$ = this.authStore.select(selectAuthIsAuth);

  constructor(
    private router: Router,
    private authStore: Store,
    private userSettings: UserSettingsService,
    public authStateService: AuthStateService,
    private service: AuthService,
    private translateService: TranslateService,
    private ngTitle: Title,
    private titleService: TitleService,
    private authSyncStorageService: AuthSyncStorageService,
  ) {
  }

  ngOnInit(): void {
    this.authSyncStorageService.init();
    this.selectIsAuth$.pipe(debounceTime(1000), take(1)).subscribe((isAuth) => {
      if (isAuth) {
        zip(this.userSettings.getUserSettings(), this.service.obtainUserClaims())
          .pipe(take(1))
          .subscribe(([userSettings, userClaims]) => {
            if (userClaims === null) {
              this.authStateService.logout();
            } else {
              console.debug('AppComponent - ngOnInit - zip - userSettings', userSettings);
              console.debug('AppComponent - ngOnInit - zip - userClaims', userClaims);
              this.authStore.dispatch(updateUserInfo({userSettings: userSettings, userClaims: userClaims}))
              this.authStateService.setLocale();
              this.translateService.use(userSettings.model.locale);
            }
          });
      } else {
        if (this.router.url.includes('reset-admin-password') ||
          this.router.url.includes('restore-password-confirmation') ||
          this.router.url.includes('restore-password')) {} else {
          this.authStateService.logout();
        }
      }
    });
    this.subChangeTitle();
  }

  subChangeTitle() {
    console.debug('AppComponent - subChangeTitle');
    const defaultTitle = 'eForm Backend';
    this.titleService.title.subscribe(title => {
      if (title && title !== defaultTitle) {
        this.ngTitle.setTitle(`${title} - ${defaultTitle}`);
      } else {
        this.ngTitle.setTitle(defaultTitle);
      }
    });
  }

  ngOnDestroy(): void {
  }
}
