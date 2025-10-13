import { Component, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import {AuthStateService} from 'src/app/common/store';
import {take} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppSettingsService} from 'src/app/common/services';
import {connectionStringExistCount} from 'src/app/state';

@AutoUnsubscribe()
@Component({
    selector: 'app-simple-layout',
    templateUrl: './simple-layout.component.html',
    standalone: false
})
export class SimpleLayoutComponent implements OnInit, OnDestroy {
  authStateService = inject(AuthStateService);
  private authStore = inject(Store);
  private renderer = inject(Renderer2);
  settingsService = inject(AppSettingsService);
  router = inject(Router);


  constructor() {
    console.debug('SimpleLayoutComponent - constructor');
  }

  ngOnInit() {
    console.debug('SimpleLayoutComponent - ngOnInit');
    this.getSettings();
    this.switchToLightTheme();
    this.authStateService.initLocale();
    console.debug('SimpleLayoutComponent - ngOnInit - done');
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
  }
}
