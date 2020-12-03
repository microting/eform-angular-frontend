import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EventBrokerService, PluginClaimsHelper} from 'src/app/common/helpers';
import {UserInfoModel, UserMenuModel} from 'src/app/common/models/user';
import {AppMenuService} from 'src/app/common/services/settings';
import {AuthService, LocaleService, UserSettingsService} from 'src/app/common/services/auth';
import {AdminService} from 'src/app/common/services/users';
import {PermissionGuard} from '../../common/guards';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @ViewChild('navigationMenu', { static: true }) menuElement: ElementRef;
  private _menuFlag = false;
  userInfo: UserInfoModel = new UserInfoModel;
  userMenu: any;
  navMenu: any;
  appMenu: UserMenuModel = new UserMenuModel();
  brokerListener: any;

  constructor(private authService: AuthService,
              private adminService: AdminService,
              private userSettingsService: UserSettingsService,
              private localeService: LocaleService,
              private translateService: TranslateService,
              private eventBrokerService: EventBrokerService,
              private appMenuService: AppMenuService) {
    this.brokerListener = eventBrokerService.listen('get-navigation-menu',
      (data: {takeFromCache: boolean}) => {
        this.getNavigationMenu(data);
      });
  }

  ngOnInit() {
    if (this.authService.isAuth) {
      this.adminService.getCurrentUserInfo().subscribe((result) => {
        this.userInfo = result;
        this.userSettingsService.getUserSettings().subscribe(((data) => {
          localStorage.setItem('locale', data.model.locale);
          this.initLocaleAsync().then(() => {
            this.getNavigationMenu({takeFromCache: false});
          });
        }));
      });
    }
  }

  async initLocaleAsync() {
    await this.localeService.initLocale();
  }

  checkGuards(guards: string[]) {
    if (guards.length === 0) {
      return true;
    }

    const currentRole = this.authService.currentRole;
    if (guards.includes(currentRole)) {
      return true;
    }

    return guards.some(g => PluginClaimsHelper.check(g));
  }

  expandMenu() {
    this._menuFlag ?
      this.menuElement.nativeElement.classList.remove('show') :
      this.menuElement.nativeElement.classList.add('show');
    this._menuFlag = !this._menuFlag;
  }

  getNavigationMenu(takeFromCacheObject: {takeFromCache: boolean}) {
    this.appMenuService.getAppMenu(takeFromCacheObject.takeFromCache).subscribe((data) => {
      this.appMenu = data;
    });
  }
}
