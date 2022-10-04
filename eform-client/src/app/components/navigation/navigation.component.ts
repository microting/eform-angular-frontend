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
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import { MenuItemModel} from 'src/app/common/models';
import { Router } from '@angular/router';

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
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

  private _transformer = (node: MenuItemModel, level: number) => {
    return {
      expandable: !!node.menuItems && node.menuItems.length > 0,
      name: node.name,
      level: level,
      e2EId: node.e2EId,
      link: node.link,
      guards: node.guards,
      isInternalLink: node.isInternalLink,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.menuItems,
  );

  hasChild = (_: number, node: FlatNode) => node.expandable;

  getLevel = (node: FlatNode) => node.level;

  menu = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

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
    if (this.authStateService.isAuth) {
      this.getCurrentUserInfoSub$ = this.adminService
        .getCurrentUserInfo()
        .subscribe((result) => {
          this.authStateService.updateUserInfo(result);
        });
      this.getAppMenuSub$ = this.appMenuService.getAppMenu().subscribe(x => {
        if (x && x.leftMenu/* && x.rightMenu*/) {
          this.menu.data = [...x.leftMenu/*, ...x.rightMenu*/];
        }
      });
    }
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
