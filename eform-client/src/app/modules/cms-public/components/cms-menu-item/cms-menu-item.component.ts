import {Component, Input} from '@angular/core';
import {CmsMenuItemModel} from 'src/app/common/models';

@Component({
  standalone: false,
  selector: 'app-cms-menu-item',
  template: `
    <mat-list-item (click)="navigate(item)">{{ item.title }}</mat-list-item>
    <ng-container *ngFor="let child of item.children">
      <app-cms-menu-item [item]="child"></app-cms-menu-item>
    </ng-container>
  `,
})
export class CmsMenuItemComponent {
  @Input() item!: CmsMenuItemModel;

  navigate(item: CmsMenuItemModel): void {
    if (item.externalUrl) {
      window.open(item.externalUrl, item.target || '_self');
    }
  }
}
