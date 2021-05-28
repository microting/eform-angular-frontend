import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import {
  AppMenuQuery,
  AppMenuStateService,
  AuthStateService,
} from 'src/app/common/store';
import { AdminService, AuthService } from 'src/app/common/services';

@AutoUnsubscribe()
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('navigationMenu', { static: true }) menuElement: ElementRef;
  private _menuFlag = false;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private appMenuService: AppMenuStateService,
    private authStateService: AuthStateService,
    public appMenuQuery: AppMenuQuery
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    if (this.authStateService.isAuth) {
      this.adminService.getCurrentUserInfo().subscribe((result) => {
        this.authStateService.updateUserInfo(result);
      });
    }
  }

  checkGuards(guards: string[]) {
    if (guards.length === 0) {
      return true;
    }

    if (guards.includes(this.authStateService.currentRole)) {
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
}
