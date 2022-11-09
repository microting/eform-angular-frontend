import {Component, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {akitaConfig} from '@datorama/akita';
import {AppMenuQuery, AuthStateService} from 'src/app/common/store';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription, take} from 'rxjs';
import {AppSettingsService, LocaleService} from 'src/app/common/services';
import {Router} from '@angular/router';
import {EventBrokerService} from 'src/app/common/helpers';
import {HeaderSettingsModel} from 'src/app/common/models';
import {MatDrawer, MatDrawerMode} from '@angular/material/sidenav';

akitaConfig({resettable: true});

@AutoUnsubscribe()
@Component({
  selector: 'app-full-layout-root',
  templateUrl: `./full-layout.component.html`,
  styleUrls: ['./full-layout.component.scss']
})
export class FullLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatDrawer
  isDarkThemeAsync$: Subscription;
  private brokerListener: any;
  logoImage: any;
  headerSettingsModel: HeaderSettingsModel = new HeaderSettingsModel;
  connectionStringExist: boolean;
  innerWidth = window.innerWidth;
  sidenavMode: MatDrawerMode = 'side';
  mobileWidth = 660;

  constructor(
    private authStateService: AuthStateService,
    private renderer: Renderer2,
    private localeService: LocaleService,
    public appMenuQuery: AppMenuQuery,
    public router: Router,
    private eventBrokerService: EventBrokerService,
    private settingsService: AppSettingsService,
  ) {
    this.brokerListener = eventBrokerService.listen<void>('get-header-settings',
      () => {
        this.getSettings();
      });
  }

  ngOnInit() {
    this.getSettings();
    this.localeService.initLocale();
    this.onResize({});
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
    this.settingsService.connectionStringExist().pipe(take(1)).subscribe((result) => {
      this.connectionStringExist = result.success;
      if (result && result.success === true) {

        this.authStateService.getUserSettings();
        this.isDarkThemeAsync$ = this.authStateService.isDarkThemeAsync.subscribe(
          (isDarkTheme) => {
            isDarkTheme
              ? this.switchToDarkTheme()
              : this.switchToLightTheme();
          }
        );

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
      } else {
        this.logoImage = '../../../assets/images/logo.png';
        this.headerSettingsModel.imageLinkVisible = true;
        this.headerSettingsModel.mainTextVisible = true;
        this.headerSettingsModel.secondaryTextVisible = true;
        this.headerSettingsModel.mainText = 'eForm Backend';
        this.headerSettingsModel.secondaryText = 'No more paper-forms and back-office data entry';
        this.router.navigate(['/application-settings/connection-string']).then();
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
    if(open === undefined || open === null) {
      this.drawer.toggle().then();
    } else {
      open ? this.drawer.open() : this.drawer.close();
    }
  }

  onClickOnLink() {
    if(this.innerWidth < this.mobileWidth) {
      this.toggleDrawer(false);
    }
  }
}
