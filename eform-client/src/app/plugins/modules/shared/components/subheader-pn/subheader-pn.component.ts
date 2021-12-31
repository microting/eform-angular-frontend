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
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'subheader-pn',
  templateUrl: './subheader-pn.component.html',
  styleUrls: ['./subheader-pn.component.scss'],
})
export class SubheaderPnComponent implements OnInit, OnDestroy {
  @ViewChild('heading', { static: true }) heading: ElementRef;

  @Input() title = '';
  @Input() subtitle = '';
  @Input() heandingSizeRem = 2.5;
  @Input() forceStaticTitle = false;

  constructor(
    private router: Router,
    private appMenuService: AppMenuStateService
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.heading.nativeElement.style.fontSize = `${this.heandingSizeRem}rem`;
    if (!this.forceStaticTitle) {
      this.title = this.appMenuService.getTitleByUrl(this.router.url);
    }
  }
}
