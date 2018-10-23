import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EventBrokerService} from 'src/app/common/helpers';
import {UserInfoModel} from 'src/app/common/models/user';
import {AuthService, LocaleService, UserSettingsService} from 'src/app/common/services/auth';
import {AdminService} from 'src/app/common/services/users';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @ViewChild('navigationMenu') menuElement: ElementRef;
  private _menuFlag = false;
  userInfo: UserInfoModel = new UserInfoModel;
  userMenu: any;
  navMenu: any;
  brokerListener: any;

  constructor(private authService: AuthService,
              private adminService: AdminService,
              private userSettingsService: UserSettingsService,
              private localeService: LocaleService,
              private translateService: TranslateService,
              private eventBrokerService: EventBrokerService) {
    this.brokerListener = eventBrokerService.listen<void>('get-navigation-menu',
      () => {
        this.initLocaleAsync().then();
        this.initNavigationMenu();
      });
  }

  ngOnInit() {
    if (this.authService.isAuth) {
      this.adminService.getCurrentUserInfo().subscribe((result) => {
        this.userInfo = result;
        this.userSettingsService.getUserSettings().subscribe(((data) => {
          localStorage.setItem('locale', data.model.locale);
          this.initLocaleAsync().then(() => {
            this.initNavigationMenu();
          });
        }));
      });
    }
  }

  async initLocaleAsync() {
    await this.localeService.initLocale();
  }

  expandMenu() {
    this._menuFlag ?
      this.menuElement.nativeElement.classList.remove('show') :
      this.menuElement.nativeElement.classList.add('show');
    this._menuFlag = !this._menuFlag;
  }

  initNavigationMenu() {
    setTimeout(() => {
      this.userMenu = {
        name: this.userInfo.firstName + ' ' + this.userInfo.lastName || 'name',
        e2eId: 'sign-out-dropdown',
        appendLeftStyles: true,
        submenus: [
          {
            name: this.translateService.instant('User Management'),
            e2eId: 'user-management-menu',
            link: '/account-management/users',
            guard: 'admin'
          },
          {
            name: this.translateService.instant('Settings'),
            e2eId: 'settings',
            link: '/account-management/settings'
          },
          {
            name: this.translateService.instant('Security'),
            e2eId: 'security',
            link: '/security'
          },
          {
            name: this.translateService.instant('Change password'),
            e2eId: 'change-password',
            link: '/account-management/change-password'
          },
          {
            name: this.translateService.instant('Logout'),
            e2eId: 'sign-out',
            link: '/auth/sign-out'
          }
        ]
      };
      this.navMenu = [
        {
          name: this.translateService.instant('My eForms'),
          e2eId: 'my-eforms',
          link: '/',
          submenus: []
        },
        {
          name: this.translateService.instant('Device Users'),
          e2eId: 'device-users',
          link: '/simplesites',
          submenus: []
        },
        {
          name: this.translateService.instant('Advanced'),
          e2eId: 'advanced',
          submenus: [
            {
              name: this.translateService.instant('Sites'),
              e2eId: 'sites',
              link: '/advanced/sites',
            },
            {
              name: this.translateService.instant('Workers'),
              e2eId: 'workers',
              link: '/advanced/workers',
            },
            {
              name: this.translateService.instant('Units'),
              e2eId: 'units',
              link: '/advanced/units',
            },
            {
              name: this.translateService.instant('Searchable list'),
              e2eId: 'search',
              link: '/advanced/entity-search',
            },
            {
              name: this.translateService.instant('Selectable list'),
              e2eId: 'selectable-list',
              link: '/advanced/entity-select'
            },
            {
              name: this.translateService.instant('Application Settings'),
              e2eId: 'application-settings',
              link: '/application-settings',
              guard: 'admin'
            }
          ]
        }
      ];
    }, 500);
  }
}
