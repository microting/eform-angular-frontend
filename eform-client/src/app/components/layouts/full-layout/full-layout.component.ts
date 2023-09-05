import {AfterContentInit, AfterViewInit, Component, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AppMenuQuery, AuthStateService} from 'src/app/common/store';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription, take, zip} from 'rxjs';
import {AppSettingsService, LoaderService, LocaleService} from 'src/app/common/services';
import {Router} from '@angular/router';
import {EventBrokerService} from 'src/app/common/helpers';
import {HeaderSettingsModel} from 'src/app/common/models';
import {MatDrawer, MatDrawerMode} from '@angular/material/sidenav';
import {filter} from 'rxjs/operators';

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
  date = new Date();
  version: string;

  constructor(
    public authStateService: AuthStateService,
    private renderer: Renderer2,
    private localeService: LocaleService,
    public appMenuQuery: AppMenuQuery,
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

  ngOnInit() {
    this.getAssemblyVersion();
    this.getSettings();
    this.loaderService.setLoading(true);
    this.localeService.initLocale();
    this.authStateService.currentUserLocaleAsync.pipe(filter(x => !!x), take(1)).subscribe(_ => this.loaderService.setLoading(false))
    this.onResize({});
    this.isDarkThemeAsync$ = this.authStateService.isDarkThemeAsync.subscribe(
      (isDarkTheme) => {
        isDarkTheme
          ? this.switchToDarkTheme()
          : this.switchToLightTheme();
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
    this.authStateService.isConnectionStringExist();
    zip(this.authStateService.isConnectionStringExistAsync, this.authStateService.isAuthAsync)
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
        } else if (!isConnectionStringExist && !isAuth) {
          this.logoImage = '../../../assets/images/logo.png';
          this.headerSettingsModel.imageLinkVisible = true;
          this.headerSettingsModel.mainTextVisible = true;
          this.headerSettingsModel.secondaryTextVisible = true;
          this.headerSettingsModel.mainText = 'eForm Backend';
          this.headerSettingsModel.secondaryText = 'No more paper-forms and back-office data entry';
          this.router.navigate(['/connection-string']).then();
        }
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

  getAssemblyVersion() {
    this.settingsService.getAssemblyVersion().subscribe(operation => {
      if (operation && operation.success) {
        this.version = operation.model;
      }
    });
  }
}
