import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CdkDropList, CdkDragMove, CdkDragRelease } from '@angular/cdk/drag-drop';

/**
 * Service to handle nested drag and drop operations in navigation menu.
 * Based on: https://stackoverflow.com/a/67337935/2144807
 * 
 * This service dynamically tracks which drop list is currently being hovered
 * during drag operations, enabling nested drag and drop functionality that
 * cdkDropListGroup doesn't support out of the box.
 */
@Injectable()
export class NavigationMenuDragDropService {
  dropLists: CdkDropList[] = [];
  currentHoverDropListId?: string;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Register a drop list with the service
   */
  public register(dropList: CdkDropList) {
    this.dropLists.push(dropList);
  }

  /**
   * Track which drop list is currently under the pointer during drag
   */
  dragMoved(event: CdkDragMove<any>) {
    const elementFromPoint = this.document.elementFromPoint(
      event.pointerPosition.x, 
      event.pointerPosition.y
    );
    
    if (!elementFromPoint) {
      this.currentHoverDropListId = undefined;
      return;
    }
    
    const dropList = elementFromPoint.classList.contains('cdk-drop-list')
      ? elementFromPoint
      : elementFromPoint.closest('.cdk-drop-list');
    
    if (!dropList) {
      this.currentHoverDropListId = undefined;
      return;
    }
    
    this.currentHoverDropListId = dropList.id;
  }

  /**
   * Clear hover state when drag is released
   */
  dragReleased(event: CdkDragRelease) {
    this.currentHoverDropListId = undefined;
  }
}
