import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { NavigationMenuDragDropService } from './navigation-menu-drag-drop.service';
import { CdkDragMove, CdkDragRelease } from '@angular/cdk/drag-drop';

describe('NavigationMenuDragDropService', () => {
  let service: NavigationMenuDragDropService;
  let mockDocument: any;

  beforeEach(() => {
    mockDocument = {
      elementFromPoint: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        NavigationMenuDragDropService,
        { provide: DOCUMENT, useValue: mockDocument }
      ]
    });
    service = TestBed.inject(NavigationMenuDragDropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register drop lists', () => {
    const mockDropList: any = { id: 'test-drop-list' };
    service.register(mockDropList);
    expect(service.dropLists).toContain(mockDropList);
  });

  it('should set currentHoverDropListId when dragging over a drop list', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'test-drop-list';
    mockElement.classList.add('cdk-drop-list');
    mockDocument.elementFromPoint.mockReturnValue(mockElement);

    const mockEvent: Partial<CdkDragMove<any>> = {
      pointerPosition: { x: 100, y: 100 }
    };

    service.dragMoved(mockEvent as CdkDragMove<any>);
    expect(service.currentHoverDropListId).toBe('test-drop-list');
  });

  it('should clear currentHoverDropListId when element is not found', () => {
    mockDocument.elementFromPoint.mockReturnValue(null);

    const mockEvent: Partial<CdkDragMove<any>> = {
      pointerPosition: { x: 100, y: 100 }
    };

    service.dragMoved(mockEvent as CdkDragMove<any>);
    expect(service.currentHoverDropListId).toBeUndefined();
  });

  it('should clear currentHoverDropListId when drag is released', () => {
    service.currentHoverDropListId = 'test-id';
    const mockEvent: Partial<CdkDragRelease> = {};

    service.dragReleased(mockEvent as CdkDragRelease);
    expect(service.currentHoverDropListId).toBeUndefined();
  });

  it('should find closest drop list when element itself is not a drop list', () => {
    const mockParentElement = document.createElement('div');
    mockParentElement.id = 'parent-drop-list';
    mockParentElement.classList.add('cdk-drop-list');

    const mockChildElement = document.createElement('span');
    mockParentElement.appendChild(mockChildElement);
    mockChildElement.closest = jest.fn().mockReturnValue(mockParentElement);

    mockDocument.elementFromPoint.mockReturnValue(mockChildElement);

    const mockEvent: Partial<CdkDragMove<any>> = {
      pointerPosition: { x: 100, y: 100 }
    };

    service.dragMoved(mockEvent as CdkDragMove<any>);
    expect(service.currentHoverDropListId).toBe('parent-drop-list');
  });
});
