import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {akitaConfig} from '@datorama/akita';
import {AppMenuQuery, AuthStateService} from 'src/app/common/store';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {AppSettingsService, LocaleService} from 'src/app/common/services';
import {Router} from '@angular/router';
import {EventBrokerService} from 'src/app/common/helpers';
import {HeaderSettingsModel} from 'src/app/common/models';

akitaConfig({resettable: true});

@AutoUnsubscribe()
@Component({
  selector: 'app-full-layout-root',
  templateUrl: `./full-layout.component.html`,
})
export class FullLayoutComponent implements OnInit, OnDestroy {
  isDarkThemeAsync$: Subscription;
  private brokerListener: any;
  logoImage: any;
  headerSettingsModel: HeaderSettingsModel = new HeaderSettingsModel;
  connectionStringExist: boolean;

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
    this.settingsService.connectionStringExist().subscribe((result) => {
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

        this.settingsService.getHeaderSettings().subscribe((data => {
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
}
