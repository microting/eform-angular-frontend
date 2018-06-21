import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UserInfoModel} from 'app/models/user';
import {AdminService, LocaleService, UserSettingsService} from 'app/services';
import {AuthService} from 'app/services/accounts/auth.service';

@Component({
  selector: 'eform-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  userInfo: UserInfoModel = new UserInfoModel;
  navigationMenu = [];
  constructor(private authService: AuthService,
              private router: Router,
              private adminService: AdminService,
              private translateService: TranslateService,
              private userSettingsService: UserSettingsService,
              private localeService: LocaleService) {
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

  initNavigationMenu() {
    setTimeout(() => {
      this.navigationMenu = [
        {
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
              e2eId: '',
              link: '/account-management/settings'
            },
            {
              name: this.translateService.instant('Change password'),
              e2eId: '',
              link: '/account-management/change-password'
            },
            {
              name: this.translateService.instant('Logout'),
              e2eId: 'sign-out',
              link: '/login/sign-out'
            }
          ]
        },
        {
          name: this.translateService.instant('My eForms'),
          e2eId: '',
          link: '/',
          submenus: []
        },
        {
          name: this.translateService.instant('Device Users'),
          e2eId: '',
          link: '/simplesites',
          submenus: []
        },
        {
          name: this.translateService.instant('Advanced'),
          e2eId: '',
          submenus: [
            {
              name: this.translateService.instant('Sites'),
              e2eId: '',
              link: '/advanced/sites',
            },
            {
              name: this.translateService.instant('Workers'),
              e2eId: '',
              link: '/advanced/workers',
            },
            {
              name: this.translateService.instant('Units'),
              e2eId: '',
              link: '/advanced/units',
            },
            {
              name: this.translateService.instant('Searchable list'),
              e2eId: '',
              link: '/advanced/entity-search',
            },
            {
              name: this.translateService.instant('Selectable list'),
              e2eId: '',
              link: '/advanced/entity-select'
            },
            {
              name: this.translateService.instant('Application Settings'),
              e2eId: '',
              link: '/application-settings',
              guard: 'admin'
            }
          ]
        },
        {
          name: 'Vehicles PN',
          e2eId: '',
          link: '/plugins/vehicles-pn',
          submenus: []
        }
      ];
    }, 500);
  }
}
