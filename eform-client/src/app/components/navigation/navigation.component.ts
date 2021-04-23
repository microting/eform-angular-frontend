import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EventBrokerService, PluginClaimsHelper } from 'src/app/common/helpers';
import { UserMenuModel } from 'src/app/common/models';
import { AppMenuService } from 'src/app/common/services/settings';
import { AdminService, LocaleService } from 'src/app/common/services';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { UserSettingsService } from 'src/app/common/services/auth/user-settings.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { AuthStateService } from 'src/app/common/store';

@AutoUnsubscribe()
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('navigationMenu', { static: true }) menuElement: ElementRef;
  private _menuFlag = false;
  appMenu: UserMenuModel = new UserMenuModel();
  brokerListener: any;
  private getAppMenu$: Subscription;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private userSettingsService: UserSettingsService,
    private localeService: LocaleService,
    private eventBrokerService: EventBrokerService,
    private appMenuService: AppMenuService,
    private authStateService: AuthStateService
  ) {
    this.brokerListener = eventBrokerService.listen(
      'get-navigation-menu',
      (data: { takeFromCache: boolean }) => {
        this.getNavigationMenu(data);
      }
    );
  }

  ngOnDestroy() {}

  ngOnInit() {
    this.getAppMenu$ = this.appMenuService.userMenuBehaviorSubject.subscribe(
      (data) => {
        this.appMenu = data;
      }
    );
    if (this.authStateService.isAuth) {
      this.adminService.getCurrentUserInfo().subscribe((result) => {
        this.authStateService.updateUserInfo(result);
        this.initLocaleAsync().then(() => {
          this.getNavigationMenu({ takeFromCache: true });
        });
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

    const currentRole = this.authStateService.currentRole;
    if (guards.includes(currentRole)) {
      return true;
    }

    return guards.some((g) => this.authStateService.checkClaim(g));
  }

  expandMenu() {
    this._menuFlag
      ? this.menuElement.nativeElement.classList.remove('show')
      : this.menuElement.nativeElement.classList.add('show');
    this._menuFlag = !this._menuFlag;
  }

  getNavigationMenu(takeFromCacheObject: { takeFromCache: boolean }) {
    this.appMenuService.getAppMenu(takeFromCacheObject.takeFromCache);
  }
}
