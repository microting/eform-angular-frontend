import {Component, Inject, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CmsPageListModel, CmsMenuItemSaveModel} from 'src/app/common/models';

export interface MenuItemDialogData {
  pages: CmsPageListModel[];
}

@Component({
  standalone: false,
  selector: 'app-cms-menu-item-dialog',
  template: `
    <h2 mat-dialog-title>Add menu item</h2>
    <mat-dialog-content style="min-width: 360px">
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 8px">
        <mat-label>Title</mat-label>
        <input matInput [(ngModel)]="item.title" required>
      </mat-form-field>

      <div style="margin-bottom: 12px">
        <label style="display: block; margin-bottom: 8px; font-weight: 500">Link type</label>
        <mat-chip-listbox [(ngModel)]="linkType">
          <mat-chip-option value="internal">Internal page</mat-chip-option>
          <mat-chip-option value="external">External URL</mat-chip-option>
        </mat-chip-listbox>
      </div>

      <mat-form-field *ngIf="linkType === 'internal'" appearance="outline" style="width: 100%">
        <mat-label>Page</mat-label>
        <mat-select [(ngModel)]="item.pageId">
          <mat-option *ngFor="let page of data.pages" [value]="page.id">{{ page.title }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field *ngIf="linkType === 'external'" appearance="outline" style="width: 100%">
        <mat-label>URL</mat-label>
        <input matInput [(ngModel)]="item.externalUrl" placeholder="https://...">
      </mat-form-field>

      <mat-form-field appearance="outline" style="width: 100%; margin-top: 8px">
        <mat-label>Open in</mat-label>
        <mat-select [(ngModel)]="item.target">
          <mat-option value="_self">Same tab</mat-option>
          <mat-option value="_blank">New tab</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="confirm()" [disabled]="!item.title">Add</button>
    </mat-dialog-actions>
  `,
})
export class CmsMenuItemDialogComponent {
  dialogRef = inject<MatDialogRef<CmsMenuItemDialogComponent>>(MatDialogRef);
  data: MenuItemDialogData = inject(MAT_DIALOG_DATA);

  linkType: 'internal' | 'external' = 'internal';
  item: CmsMenuItemSaveModel = {title: '', target: '_self', order: 0};

  confirm(): void {
    if (!this.item.title) return;
    this.dialogRef.close(this.item);
  }
}
