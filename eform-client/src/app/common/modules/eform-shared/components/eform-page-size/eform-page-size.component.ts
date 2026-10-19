import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'eform-page-size',
    templateUrl: './eform-page-size.component.html',
    imports: [NgSelectComponent, ReactiveFormsModule, FormsModule, TranslatePipe]
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
