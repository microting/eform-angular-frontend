import {Component, ElementRef, Input, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {EventBrokerService} from 'src/app/common/helpers';
import {AppMenuService} from 'src/app/common/services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {MenuItemModel} from 'src/app/common/models';
import {TranslateService} from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
  selector: 'subheader-pn',
  templateUrl: './subheader-pn.component.html',
  styleUrls: ['./subheader-pn.component.scss']
})
export class SubheaderPnComponent implements OnInit, OnDestroy {

  @ViewChild('heading', { static: true }) heading: ElementRef;

  @Input() title = '';
  @Input() subtitle = '';
  @Input() heandingSizeRem = 2.5;
  @Input() forceStaticTitle = false;

  getAppMenu$: Subscription;
  getTranslation$: Subscription;

  constructor(private router: Router,
              private appMenuService: AppMenuService,
              private translateService: TranslateService) { }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.heading.nativeElement.style.fontSize = `${this.heandingSizeRem}rem`;

    const href = this.router.url;
    this.getAppMenu$ = this.appMenuService.userMenuBehaviorSubject.subscribe((data) => {
      if (data.rightMenu.length > 0 && data.leftMenu.length > 0) {
        let title = this.searchTitle(href, data.leftMenu);
        if (!title) {
          title = this.searchTitle(href, data.rightMenu);
        }
        if (title) {
          this.getTranslation$ = this.translateService.get(title)
            .subscribe(result => this.title = result);
        }
      }
    });
  }
  searchTitle(href: string, menuItems: MenuItemModel[]): string {
    for (const menuItem of menuItems) {
      if (href.charAt(0) !== '/') {
        href = '/' + href;
      }
      if (menuItem.link.charAt(0) !== '/') {
        menuItem.link = '/' + menuItem.link;
      }
      if (menuItem.link === href) {
        return menuItem.name;
      }
      if (menuItem.menuItems.length > 0) {
        const title = this.searchTitle(href, menuItem.menuItems);
        if (title) {
          return title;
        }
      }
    }
    return this.title;
  }
}
