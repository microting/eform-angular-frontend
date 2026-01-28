import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AppMenuStateService } from 'src/app/common/store';
import {TitleService} from 'src/app/common/services';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import { MatCard } from '@angular/material/card';
import { NgIf, NgFor } from '@angular/common';

@AutoUnsubscribe()
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'eform-new-subheader',
    templateUrl: './eform-new-subheader.component.html',
    styleUrls: ['./eform-new-subheader.component.scss'],
    imports: [MatCard, NgIf, NgFor, RouterLink, TranslatePipe]
})
export class EformNewSubheaderComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  appMenuStateService = inject(AppMenuStateService);
  private titleService = inject(TitleService);
  private translateService = inject(TranslateService);

  @Input() subtitle = '';
  @Input() title = '';
  @Input() forceStaticTitle = false;
  @Input() breadcrumbs: { name: string; href?: string }[] = null;
  href = this.router.url;
  appMenuSub$: Subscription;
  getTranslatedTitleSub$: Subscription;

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
