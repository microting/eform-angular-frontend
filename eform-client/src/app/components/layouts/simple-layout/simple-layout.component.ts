import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AuthStateService} from 'src/app/common/store';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Router} from '@angular/router';
import {
  selectConnectionStringExists,
  selectConnectionStringWithCount,
  selectIsDarkMode
} from "src/app/state/auth/auth.selector";
import {Store} from "@ngrx/store";

@AutoUnsubscribe()
@Component({
  selector: 'app-simple-layout',
  templateUrl: './simple-layout.component.html',
})
export class SimpleLayoutComponent implements OnInit, OnDestroy {
  isDarkThemeAsync$: Subscription;
  isConnectionStringExistTrueSub$: Subscription;
  isConnectionStringExistFalseSub$: Subscription;
  private selectIsDarkMode$ = this.authStore.select(selectIsDarkMode);
  private selectConnectionStringWithCount$ = this.authStore.select(selectConnectionStringWithCount);

  constructor(
    public authStateService: AuthStateService,
    private authStore: Store,
    private renderer: Renderer2,
    public router: Router,
  ) {
  }

  ngOnInit() {
    this.getSettings();
    this.isDarkThemeAsync$ = this.selectIsDarkMode$.subscribe(
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
    this.isConnectionStringExistTrueSub$ = this.selectConnectionStringWithCount$
      //.pipe(filter(connectionString => connectionString.isConnectionStringExist === true))
      .subscribe((connectionString) => {
        if (connectionString.isConnectionStringExist === true) {
          if (connectionString.count > 0) { // connection string exist
            if(!this.router.url.includes('auth')) { // page not include auth
              this.router.navigate(['/auth']).then();
            }
          } else { // it's initial value, so need get not initial value
            this.authStateService.isConnectionStringExist();
          }
        } else {
          this.router
            .navigate(['/connection-string'])
            .then();
        }
      });

    // this.isConnectionStringExistFalseSub$ = this.authStateService.IsConnectionStringExistWithCountAsync.pipe(
    //   filter(connectionString => connectionString.isConnectionStringExist === false))
    //   .subscribe(() => {
    //       this.router
    //         .navigate(['/connection-string'])
    //         .then();
    //     setTimeout(() => {
    //       this.authStateService.isConnectionStringExist();
    //     }, 90000);
    //
    //   });
  }

  ngOnDestroy() {
  }
}
