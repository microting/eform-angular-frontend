import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AuthStateService} from 'src/app/common/store';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

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
  ) {
  }

  ngOnInit() {
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

  ngOnDestroy() {
  }
}
