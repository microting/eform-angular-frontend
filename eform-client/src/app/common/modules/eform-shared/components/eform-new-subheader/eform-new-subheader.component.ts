import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AppMenuStateService } from 'src/app/common/store';
import {TitleService} from 'src/app/common/services';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@AutoUnsubscribe()
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'eform-new-subheader',
    templateUrl: './eform-new-subheader.component.html',
    styleUrls: ['./eform-new-subheader.component.scss'],
    standalone: false
})
export class EformNewSubheaderComponent implements OnInit, OnDestroy {
  @Input() subtitle = '';
  @Input() title = '';
  @Input() forceStaticTitle = false;
  @Input() breadcrumbs: { name: string; href?: string }[] = null;
  href = this.router.url;
  appMenuSub$: Subscription;
  getTranslatedTitleSub$: Subscription;

  constructor(
    private router: Router,
    public appMenuStateService: AppMenuStateService,
    private titleService: TitleService,
    private translateService: TranslateService,
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    // TODO: Fix this
    // this.appMenuSub$ = this.appMenuStateService.appMenuObservable.subscribe((appMenu) => {
    //   if (appMenu && appMenu.rightMenu && appMenu.leftMenu) {
    //     const notStaticTitle = this.appMenuStateService.getTitleByUrl(this.href);
    //     if (notStaticTitle) {
    //       this.getTranslatedTitleSub$ = this.translateService.get(notStaticTitle).subscribe(title => this.titleService.setTitle(title));
    //     } else {
    //       this.titleService.setTitle(this.title);
    //     }
    //   }
    // })
    // if (!this.forceStaticTitle || !this.title) {
    //   const href = this.router.url;
    //   this.appMenuStateService.getAppMenu().subscribe((_) => {
    //     const foundTitle = this.appMenuStateService.getTitleByUrl(href);
    //     if (foundTitle) {
    //       // this.internalTitle = foundTitle;
    //       this.title = foundTitle;
    //     }
    //   });
    // }
  }
}
