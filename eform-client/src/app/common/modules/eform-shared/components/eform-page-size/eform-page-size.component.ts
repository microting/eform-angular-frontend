import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'eform-page-size',
    templateUrl: './eform-page-size.component.html',
    standalone: false
})
export class EformPageSizeComponent {
  @Input() pageSize: number;
  @Output()
  onPageSizeChanged: EventEmitter<number> = new EventEmitter<number>();
  pageSizes = [5, 10, 100, 1000, 100000];

  constructor() {}

  updateCurrentPageSettings(e: any) {
    this.onPageSizeChanged.emit(e);
  }
}
