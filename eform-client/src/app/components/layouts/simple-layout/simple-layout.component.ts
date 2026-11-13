import { Component, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import {AuthStateService} from 'src/app/common/store';
import {combineLatest, Subscription, take} from 'rxjs';
import {ThemeModeService} from 'src/app/common/services/theme-mode.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import { Router, RouterOutlet } from '@angular/router';
import {Store} from '@ngrx/store';
import {AppSettingsService} from 'src/app/common/services';
import {connectionStringExistCount, selectIsDarkMode, selectThemeMode} from 'src/app/state';

@AutoUnsubscribe()
@Component({
    selector: 'app-simple-layout',
    templateUrl: './simple-layout.component.html',
    imports: [RouterOutlet]
})
export class SimpleLayoutComponent implements OnInit, OnDestroy {
  authStateService = inject(AuthStateService);
  private authStore = inject(Store);
  private renderer = inject(Renderer2);
  settingsService = inject(AppSettingsService);
  router = inject(Router);
  private themeModeService = inject(ThemeModeService);
  private appearanceSub$: Subscription;
  private modeSub$: Subscription;


  constructor() {
    console.debug('SimpleLayoutComponent - constructor');
  }

  ngOnInit() {
    console.debug('SimpleLayoutComponent - ngOnInit');
    this.getSettings();
    // derive the mode like full-layout does: never assert one into the app-wide singleton. Signed out, the
    // reducer is back at its initial state (themeMode 'system'), so the sign-in page follows the OS.
    this.appearanceSub$ = this.themeModeService.appearance$.subscribe(
      (appearance) => appearance === 'dark' ? this.switchToDarkTheme() : this.switchToLightTheme()
    );
    this.modeSub$ = combineLatest([this.authStore.select(selectThemeMode), this.authStore.select(selectIsDarkMode)]).subscribe(
      ([mode, isDark]) => this.themeModeService.setMode(mode, !!isDark)
    );
    this.authStateService.initLocale();
    console.debug('SimpleLayoutComponent - ngOnInit - done');
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
    this.settingsService.connectionStringExist()
      .pipe(take(1))
      .subscribe(
        (result) => {
          if (!result || (result && !result.success)) {
            this.authStore.dispatch(connectionStringExistCount({count: 2, isConnectionStringExist: false}));
            this.router.navigate(['/connection-string']).then();
          } else if (result && result.success) {
            this.authStore.dispatch(connectionStringExistCount({count: 2, isConnectionStringExist: true}));
          }
        }
      );
  }

  ngOnDestroy() {
    this.appearanceSub$?.unsubscribe();
    this.modeSub$?.unsubscribe();
  }
}
