import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AppMenuStateService } from 'src/app/common/store';

@AutoUnsubscribe()
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'eform-subheader',
    templateUrl: './eform-subheader.component.html',
    styleUrls: ['./eform-subheader.component.scss'],
    standalone: false
})
export class EformSubheaderComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() heandingSizeRem = 2.5;
  @Input() forceStaticTitle = false;
  @Input() breadcrumbs: { name: string; href?: string }[] = null;
  href = this.router.url;

  // internalTitle = '';

  constructor(
    private router: Router,
    public appMenuStateService: AppMenuStateService
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
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
