import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { akitaConfig } from '@datorama/akita';
import { AuthStateService } from 'src/app/common/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { LocaleService } from 'src/app/common/services';

akitaConfig({ resettable: true });

@AutoUnsubscribe()
@Component({
  selector: 'app-full-layout-root',
  templateUrl: `./full-layout.component.html`,
})
export class FullLayoutComponent implements OnInit, OnDestroy {
  isDarkThemeAsync$: Subscription;
  constructor(
    private authStateService: AuthStateService,
    private renderer: Renderer2,
    private localeService: LocaleService
  ) {}

  ngOnInit() {
    this.isDarkThemeAsync$ = this.authStateService.isDarkThemeAsync.subscribe(
      (isDarkTheme) => {
        isDarkTheme
          ? this.renderer.addClass(document.body, 'theme-dark')
          : this.renderer.removeClass(document.body, 'theme-dark');
      }
    );

    this.localeService.initLocale();
  }

  ngOnDestroy() {}
}
