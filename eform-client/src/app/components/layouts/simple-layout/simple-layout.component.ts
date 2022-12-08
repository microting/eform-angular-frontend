import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AuthStateService} from 'src/app/common/store';
import {Subscription, take, zip} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {AppSettingsService} from 'src/app/common/services';
import {Router} from '@angular/router';

@AutoUnsubscribe()
@Component({
  selector: 'app-simple-layout',
  templateUrl: './simple-layout.component.html',
})
export class SimpleLayoutComponent implements OnInit, OnDestroy {
  isDarkThemeAsync$: Subscription;

  constructor(
    public authStateService: AuthStateService,
    private renderer: Renderer2,
    public router: Router,
  ) {
  }

  ngOnInit() {
    this.getSettings();
    this.isDarkThemeAsync$ = this.authStateService.isDarkThemeAsync.subscribe(
      (isDarkTheme) => {
        isDarkTheme
          ? this.switchToDarkTheme()
          : this.switchToLightTheme();
      }
    );
  }

  switchToDarkTheme() {
    this.renderer.addClass(document.body, 'theme-dark');
    this.renderer.removeClass(document.body, 'theme-light');
  }

  switchToLightTheme() {
    this.renderer.addClass(document.body, 'theme-light');
    this.renderer.removeClass(document.body, 'theme-dark');
  }

  getSettings() {
    this.authStateService.isConnectionStringExist();
    zip(this.authStateService.isConnectionStringExistAsync, this.authStateService.isAuthAsync)
      .subscribe(([isConnectionStringExist, isAuth]) => {
        if (!isConnectionStringExist && !isAuth) {
          this.router.navigate(['/application-settings/connection-string']).then();
        } else if (isConnectionStringExist && !isAuth) {
          this.router.navigate(['/auth']).then();
        }
      });
  }

  ngOnDestroy() {
  }
}
