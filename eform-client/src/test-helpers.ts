import { Component, Input, Pipe, PipeTransform, TemplateRef } from '@angular/core';

/**
 * Mock TranslatePipe for testing
 * Returns the key as-is or a simple transformed version
 */
@Pipe({ 
  name: 'translate',
  standalone: false
})
export class MockTranslatePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

/**
 * Stand-in for mtx-grid that renders each row's `actions` cell template with the same
 * context the real grid passes ($implicit row, index), so a spec can assert on a row's
 * action menu without the real grid.
 */
@Component({
  selector: 'mtx-grid',
  template: `
    @for (row of data ?? []; track $index) {
      <ng-container *ngTemplateOutlet="cellTemplate?.actions; context: {$implicit: row, index: $index}"></ng-container>
    }
  `,
  standalone: false
})
export class MockMtxGridComponent {
  @Input() data: any[];
  @Input() columns: any[];
  @Input() cellTemplate: {[field: string]: TemplateRef<any>};
  @Input() showPaginator: boolean;
  @Input() pageOnFront: boolean;
  @Input() rowStriped: boolean;
  @Input() showToolbar: boolean;
  @Input() showColumnMenuButton: boolean;
  @Input() toolbarTemplate: TemplateRef<any>;
}

/**
 * Stand-in for mat-menu that renders its items inline, so a spec can see which items a
 * row menu offers without opening the overlay.
 */
@Component({
  selector: 'mat-menu',
  exportAs: 'matMenu',
  template: '<ng-content></ng-content>',
  standalone: false
})
export class MockMatMenuComponent {}
