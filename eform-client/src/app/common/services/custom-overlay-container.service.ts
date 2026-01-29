import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

/**
 * Custom OverlayContainer that works with Angular 21's native popover API.
 * 
 * Angular 21 uses the browser's top layer for modals (via popover="manual"),
 * which means CDK overlays (dropdowns, tooltips) appear behind modals.
 * 
 * This service dynamically moves the overlay container inside the active modal
 * so overlays render above the modal content.
 * 
 * Based on: https://qupaya.com/blog/using-the-angular-cdk-overlay-with-native-dialogs/
 * Issue: https://github.com/angular/components/issues/28133
 */
@Injectable({ providedIn: 'root' })
export class CustomOverlayContainer extends OverlayContainer {
  private containerStack: HTMLElement[] = [];

  /**
   * Set a custom parent element for the overlay container.
   * Call this when opening a modal to move overlays inside it.
   * 
   * @param element The modal/dialog element to append overlays to
   */
  public setContainerParent(element: HTMLElement): void {
    // Save current parent to stack for restoration
    if (this._containerElement) {
      this.containerStack.push(this._containerElement.parentElement as HTMLElement);
    }

    // Move overlay container to the new parent (modal)
    if (this._containerElement && element) {
      element.appendChild(this._containerElement);
    }
  }

  /**
   * Restore the overlay container to its previous parent.
   * Call this when closing a modal.
   */
  public restoreContainerParent(): void {
    if (!this._containerElement) {
      return;
    }

    const previousParent = this.containerStack.pop();
    if (previousParent) {
      previousParent.appendChild(this._containerElement);
    } else {
      // Fallback to body if no previous parent
      document.body.appendChild(this._containerElement);
    }
  }

  /**
   * Override to ensure container is created in body by default
   */
  protected override _createContainer(): void {
    super._createContainer();
    
    // Ensure it starts in the body
    if (this._containerElement && !this._containerElement.parentElement) {
      document.body.appendChild(this._containerElement);
    }
  }
}
