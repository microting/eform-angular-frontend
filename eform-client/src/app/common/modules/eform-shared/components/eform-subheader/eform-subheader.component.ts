import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AppMenuStateService } from 'src/app/common/store';

@AutoUnsubscribe()
@Component({
  selector: 'eform-subheader',
  templateUrl: './eform-subheader.component.html',
  styleUrls: ['./eform-subheader.component.scss'],
})
export class EformSubheaderComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() heandingSizeRem = 2.5;
  @Input() forceStaticTitle = false;
  @Input() prioritizeMenuTitle = false;

  internalTitle = '';

  constructor(
    private router: Router,
    private appMenuStateService: AppMenuStateService
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    if (!this.forceStaticTitle) {
      const href = this.router.url;
      this.appMenuStateService.getAppMenu().subscribe((_) => {
        const foundTitle = this.appMenuStateService.getTitleByUrl(href);
        if (foundTitle) {
          this.internalTitle = foundTitle;
        }
      });
    }
  }
}
