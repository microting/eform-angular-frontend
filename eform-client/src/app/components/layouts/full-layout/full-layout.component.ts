import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import {AuthStateService} from 'src/app/common/store';
import {ThemeModeService} from 'src/app/common/services/theme-mode.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {combineLatest, Observable, of, Subscription, take, tap} from 'rxjs';
import {
  AppSettingsService,
  LoaderService,
} from 'src/app/common/services';
import { Router, RouterOutlet } from '@angular/router';
import {EventBrokerService, snakeToCamel} from 'src/app/common/helpers';
import {HeaderSettingsModel} from 'src/app/common/models';
import { MatDrawer, MatDrawerMode, MatDrawerContainer } from '@angular/material/sidenav';
import {debounceTime, filter, map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {
  selectAuthIsAuth,
  selectConnectionStringExists,
  selectCurrentUserLocale,
  selectIsDarkMode,
  selectThemeMode,
  selectSideMenuOpened,
  rightAppMenus, selectCurrentUserClaims, selectCurrentUserName, selectCurrentUserFullName, selectCurrentUserAvatarUrl,
} from 'src/app/state';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NavigationComponent } from '../../navigation/navigation.component';
import { FooterComponent } from '../../footer/footer.component';
import { SimpleLayoutComponent } from '../simple-layout/simple-layout.component';
import { AuthImagePipe } from 'src/app/common/pipes';

@AutoUnsubscribe()
@Component({
    selector: 'app-full-layout-root',
    templateUrl: `./full-layout.component.html`,
    styleUrls: ['./full-layout.component.scss'],
    imports: [NgIf, MatToolbar, MatIconButton, MatIcon, MatDrawerContainer, MatDrawer, NavigationComponent, FooterComponent, RouterOutlet, SimpleLayoutComponent, AsyncPipe, AuthImagePipe]
})
export class FullLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  authStateService = inject(AuthStateService);
  private renderer = inject(Renderer2);
  private authStore = inject(Store);
  private store = inject(Store);
  router = inject(Router);
  private eventBrokerService = inject(EventBrokerService);
  private settingsService = inject(AppSettingsService);
  private loaderService = inject(LoaderService);
  private themeModeService = inject(ThemeModeService);

  @ViewChild('drawer') drawer: MatDrawer;
  isDarkThemeAsync$: Subscription;
  private themeModeSub$: Subscription;
  private brokerListener: any;
  logoImage: string;
  headerSettingsModel: HeaderSettingsModel = new HeaderSettingsModel;
  innerWidth = window.innerWidth;
  sidenavMode: MatDrawerMode = 'side';
  mobileWidth = 660;
  openedChangeSub$: Subscription;
  public selectConnectionStringExists$ = this.authStore.select(selectConnectionStringExists);
  public selectIsAuth$ = this.authStore.select(selectAuthIsAuth);
  private selectIsDarkMode$ = this.authStore.select(selectIsDarkMode);
  private selectThemeMode$ = this.authStore.select(selectThemeMode);
  private selectCurrentUserLocale$ = this.authStore.select(selectCurrentUserLocale);
  public selectCurrentUserName$ = this.authStore.select(selectCurrentUserName);
  public selectCurrentUserFullName$ = this.authStore.select(selectCurrentUserFullName);
  public selectCurrentUserAvatarUrl$ = this.authStore.select(selectCurrentUserAvatarUrl);
  public selectSideMenuOpened$ = this.authStore.select(selectSideMenuOpened);
  private selectCurrentUserClaims$ = this.authStore.select(selectCurrentUserClaims);

  constructor() {
    const eventBrokerService = this.eventBrokerService;

    this.brokerListener = eventBrokerService.listen<void>('get-header-settings',
      () => {
        this.getSettings();
      });
  }

  public allAppMenus$ = this.store.select(rightAppMenus);

  ngOnInit() {
    console.debug('FullLayoutComponent - ngOnInit');
    this.loaderService.setLoading(true);
    of(null).pipe(debounceTime(1500)).subscribe(() => this.getSettings());
    this.selectCurrentUserLocale$.pipe(
      filter(x => !!x),
      take(1),
      tap(() => {
        this.authStateService.initLocale();
        this.loaderService.setLoading(false)
      })
    ).subscribe();
    this.onResize({});
  }

  ngAfterViewInit() {
    console.debug('FullLayoutComponent - afterViewInit');
    if (this.drawer) {
      this.openedChangeSub$ = this.drawer.openedChange.subscribe(opened => this.authStateService.updateSideMenuOpened(opened));
    }
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
    this.brokerListener?.ignore();
    this.isDarkThemeAsync$?.unsubscribe();
    this.themeModeSub$?.unsubscribe();
  }

  getSettings() {
    this.selectIsAuth$.pipe(take(1)).subscribe((isAuth) => {
      if (isAuth) {
        // getSettings can run more than once (header-settings broker event): never stack subscriptions
        this.isDarkThemeAsync$?.unsubscribe();
        this.themeModeSub$?.unsubscribe();
        // paint from the resolved appearance; the OS flipping is a media-query event, never an HTTP request
        this.isDarkThemeAsync$ = this.themeModeService.appearance$.subscribe(
          (appearance) => {
            appearance === 'dark'
              ? this.switchToDarkTheme()
              : this.switchToLightTheme();
          }
        );
        // always pass the current stored bool: it is the fallback for a browser without matchMedia
        this.themeModeSub$ = combineLatest([this.selectThemeMode$, this.selectIsDarkMode$]).subscribe(
          ([mode, isDark]) => this.themeModeService.setMode(mode, !!isDark)
        );
        this.getHeaderSettings();
      }
    });
  }

  getHeaderSettings() {
    this.settingsService.getHeaderSettings().pipe(take(1)).subscribe((data => {
      if (data && data.success) {
        this.headerSettingsModel = data.model;
        if (this.headerSettingsModel.imageLink && this.headerSettingsModel.imageLinkVisible) {
          this.logoImage = 'api/images/eform-images?fileName=' + this.headerSettingsModel.imageLink;
        } else if (!this.headerSettingsModel.imageLink) {
          this.logoImage = '../../../assets/images/logo.png';
        }
      }
    }));
  }

  @HostListener('window:resize', ['$event'])
  onResize(_) {
    const oldInnerWidth = this.innerWidth;
    this.innerWidth = window.innerWidth;
    this.sidenavMode = this.innerWidth >= this.mobileWidth ? 'side' : 'over';
    if (oldInnerWidth === this.innerWidth) {
      return;
    }
    if (oldInnerWidth < this.mobileWidth && this.innerWidth >= this.mobileWidth) {
      this.toggleDrawer(true);
    } else if (oldInnerWidth >= this.mobileWidth && this.innerWidth < this.mobileWidth) {
      this.toggleDrawer(false);
    }
  }

  toggleDrawer(open?: boolean) {
    if (open === undefined || open === null) {
      this.drawer.toggle().then();
    } else {
      open ? this.drawer.open() : this.drawer.close();
    }
  }

  onClickOnLink() {
    if (this.innerWidth < this.mobileWidth) {
      this.toggleDrawer(false);
    }
  }

  checkGuards(guards: string[]): Observable<boolean> {
    if (guards.length === 0) {
      return new Observable<boolean>(x => x.next(true));
    }
    return this.selectCurrentUserClaims$.pipe(map(x => {
      for (const guard of guards) {
        if (x[snakeToCamel(guard)]) {
          return true;
        }
      }
      return false;
    }));
  }

  getavatarurl() {
    // get one result from observable and return as string
    let avatarUrl = '';
    this.selectCurrentUserAvatarUrl$.pipe(take(1)).subscribe(url => {
      avatarUrl = url;
    });
    return avatarUrl;
  }
}
