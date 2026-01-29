import { Injectable, ComponentType, inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CustomOverlayContainer } from './custom-overlay-container.service';
import { filter, take } from 'rxjs/operators';

/**
 * Wrapper service for MatDialog that automatically manages overlay container
 * placement for Angular 21's popover top layer.
 * 
 * This service ensures dropdowns and overlays within dialogs appear correctly
 * by moving the CDK overlay container inside the dialog element.
 */
@Injectable({ providedIn: 'root' })
export class DialogWrapperService {
  private dialog = inject(MatDialog);
  private overlayContainer = inject(CustomOverlayContainer);
  
  /**
   * Opens a modal dialog and manages overlay container placement.
   * 
   * @param component The component to display in the dialog
   * @param config Dialog configuration options
   * @returns DialogRef for the opened dialog
   */
  public open<T, D = any, R = any>(
    component: ComponentType<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {
    const dialogRef = this.dialog.open(component, config);

    // Wait for dialog to open and DOM to be ready
    setTimeout(() => {
      // Find the dialog container element
      const dialogElement = document.querySelector('.mat-mdc-dialog-container');
      if (dialogElement) {
        // Move overlay container inside this dialog
        this.overlayContainer.setContainerParent(dialogElement as HTMLElement);
      }
    }, 0);

    // Restore overlay container when dialog closes
    dialogRef.afterClosed().pipe(
      take(1)
    ).subscribe(() => {
      this.overlayContainer.restoreContainerParent();
    });

    return dialogRef;
  }

  /**
   * Closes all currently open dialogs
   */
  public closeAll(): void {
    this.dialog.closeAll();
  }

  /**
   * Gets a reference to an open dialog by ID
   */
  public getDialogById(id: string): MatDialogRef<any> | undefined {
    return this.dialog.getDialogById(id);
  }
}
