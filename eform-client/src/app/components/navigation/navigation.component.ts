import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit, Output,
  ViewChild,
} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {
  AppMenuStateService,
  AuthStateService,
} from 'src/app/common/store';
import {AdminService, AuthService} from 'src/app/common/services';
import {Subscription} from 'rxjs';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import {Router} from '@angular/router';
import {filter} from 'rxjs/operators';

interface MenuNode {
  name: string;
  menuItems?: MenuNode[];
  link: string;
  e2EId: string;
  position: number;
  isInternalLink: boolean;
  guards: Array<string>;
}

@AutoUnsubscribe()
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('navigationMenu', {static: true}) menuElement: ElementRef;
  @Output() clickOnLink: EventEmitter<void> = new EventEmitter<void>();

  treeControl = new NestedTreeControl<MenuNode>(node => node.menuItems);

  hasChild = (_: number, node: MenuNode) => !!node.menuItems && node.menuItems.length > 0;

  menu = new MatTreeNestedDataSource<MenuNode>();

  getAppMenuSub$: Subscription;
  getCurrentUserInfoSub$: Subscription;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private appMenuService: AppMenuStateService,
    private authStateService: AuthStateService,
    public router: Router,
  ) {
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.authStateService.isAuthAsync.pipe(filter(isAuth => isAuth === true)).subscribe(isAuth => {
      this.getCurrentUserInfoSub$ = this.adminService
        .getCurrentUserInfo()
        .subscribe((result) => {
          this.authStateService.updateUserInfo(result);
          this.appMenuService.getAppMenu();
          this.getAppMenuSub$ = this.appMenuService.userMenuLeftAsync.subscribe(x => {
            if (x !== undefined) {
              this.menu.data = [...x];
            }
          });
        });
    });
  }

  checkGuards(guards: string[]) {
    if (guards.length === 0) {
      return true;
    }

    return guards.some((g) => this.authStateService.checkClaim(g));
  }

  onClickOnNode() {
    this.clickOnLink.emit();
  }
}
