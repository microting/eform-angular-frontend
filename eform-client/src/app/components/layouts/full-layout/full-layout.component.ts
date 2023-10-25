import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AuthStateService} from 'src/app/common/store';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Observable, Subscription, take, zip} from 'rxjs';
import {AppSettingsService, LoaderService, LocaleService} from 'src/app/common/services';
import {Router} from '@angular/router';
import {EventBrokerService} from 'src/app/common/helpers';
import {HeaderSettingsModel, MenuItemModel} from 'src/app/common/models';
import {MatDrawer, MatDrawerMode} from '@angular/material/sidenav';
import {filter} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {rightAppMenus} from 'src/app/state/app-menu/app-menu.selector';
import {
  selectAuthIsAuth,
  selectConnectionStringExists,
  selectCurrentUserLocale,
  selectIsDarkMode, selectSideMenuOpened
} from 'src/app/state/auth/auth.selector';

@AutoUnsubscribe()
@Component({
  selector: 'app-full-layout-root',
  templateUrl: `./full-layout.component.html`,
  styleUrls: ['./full-layout.component.scss']
})
export class FullLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('drawer') drawer: MatDrawer;
  isDarkThemeAsync$: Subscription;
  private brokerListener: any;
  logoImage: any;
  headerSettingsModel: HeaderSettingsModel = new HeaderSettingsModel;
  innerWidth = window.innerWidth;
  sidenavMode: MatDrawerMode = 'side';
  mobileWidth = 660;
  openedChangeSub$: Subscription;
  public selectConnectionStringExists$ = this.authStore.select(selectConnectionStringExists);
  private selectIsAuth$ = this.authStore.select(selectAuthIsAuth);
  private selectIsDarkMode$ = this.authStore.select(selectIsDarkMode);
  private selectCurrentUserLocale$ = this.authStore.select(selectCurrentUserLocale);
  public selectSideMenuOpened$ = this.authStore.select(selectSideMenuOpened);

  constructor(
    public authStateService: AuthStateService,
    private renderer: Renderer2,
    private localeService: LocaleService,
    private authStore: Store,
    //public appMenuQuery: AppMenuQuery,
    private store: Store,
    public router: Router,
    private eventBrokerService: EventBrokerService,
    private settingsService: AppSettingsService,
    private loaderService: LoaderService,
  ) {
    this.brokerListener = eventBrokerService.listen<void>('get-header-settings',
      () => {
        this.getSettings();
      });
  }
  public allAppMenus$ = this.store.select(rightAppMenus);

  ngOnInit() {
    this.getSettings();
    this.loaderService.setLoading(true);
    this.localeService.initLocale();
    this.selectCurrentUserLocale$.pipe(filter(x => !!x), take(1)).subscribe(_ => this.loaderService.setLoading(false))
    this.onResize({});
    this.isDarkThemeAsync$ = this.selectIsDarkMode$.subscribe(
      (isDarkTheme) => {
        isDarkTheme
          ? this.switchToDarkTheme()
          : this.switchToLightTheme();
        //this.allAppMenus$ = this.store.select(rightAppMenus);
          // this.menu = new MatTreeNestedDataSource<MenuItemModel>();
          // this.menu.data = data;
          // this.menu.data.forEach(x => {
          //   x.menuItems = x.menuItems.sort((a, b) => a.position - b.position);
          // });
        //});
      }
    );
  }

  ngAfterViewInit() {
    this.openedChangeSub$ = this.drawer.openedChange.subscribe(opened => this.authStateService.updateSideMenuOpened(opened));
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

  getSettings() {
    // TODO: Fix this
    this.authStateService.isConnectionStringExist();
    zip(this.selectConnectionStringExists$, this.selectIsAuth$)
      .subscribe(([isConnectionStringExist, isAuth]) => {
        if (isConnectionStringExist && isAuth) {
          this.authStateService.getUserSettings();
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
        // else if (!isConnectionStringExist && !isAuth) {
        //   this.logoImage = '../../../assets/images/logo.png';
        //   this.headerSettingsModel.imageLinkVisible = true;
        //   this.headerSettingsModel.mainTextVisible = true;
        //   this.headerSettingsModel.secondaryTextVisible = true;
        //   this.headerSettingsModel.mainText = 'eForm Backend';
        //   this.headerSettingsModel.secondaryText = 'No more paper-forms and back-office data entry';
        //   this.router.navigate(['/connection-string']).then();
        // }
      });
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
}
