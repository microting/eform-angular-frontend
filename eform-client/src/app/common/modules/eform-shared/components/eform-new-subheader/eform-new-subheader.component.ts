import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AppMenuStateService } from 'src/app/common/store';

@AutoUnsubscribe()
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'eform-new-subheader',
  templateUrl: './eform-new-subheader.component.html',
  styleUrls: ['./eform-new-subheader.component.scss'],
})
export class EformNewSubheaderComponent implements OnInit, OnDestroy {
  @Input() subtitle = '';
  @Input() title = '';
  @Input() forceStaticTitle = false;
  @Input() breadcrumbs: { name: string; href?: string }[] = null;
  href = this.router.url;

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
