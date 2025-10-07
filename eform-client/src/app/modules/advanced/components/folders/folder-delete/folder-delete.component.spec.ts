import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FolderDeleteComponent } from './folder-delete.component';
import { FoldersService } from 'src/app/common/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FolderDto, OperationResult } from 'src/app/common/models';
import { MockTranslatePipe } from 'src/test-helpers';

describe('FolderDeleteComponent', () => {
  let component: FolderDeleteComponent;
  let fixture: ComponentFixture<FolderDeleteComponent>;
  let mockFoldersService: any;
  let mockDialogRef: any;
  let mockDialogData: FolderDto;

  beforeEach(waitForAsync(() => {
    mockFoldersService = {
          deleteSingleFolder: jest.fn(),
        };
    mockDialogRef = {
          close: jest.fn(),
        };
    mockDialogData = { id: 1, name: 'Test Folder' } as FolderDto;

    TestBed.configureTestingModule({
      declarations: [FolderDeleteComponent, MockTranslatePipe],
      providers: [
        { provide: FoldersService, useValue: mockFoldersService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderDeleteComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with dialog data', () => {
    expect(component.selectedFolderDto).toBeDefined();
    expect(component.selectedFolderDto.id).toBe(1);
    expect(component.selectedFolderDto.name).toBe('Test Folder');
  });

  describe('ngOnInit', () => {
    it('should initialize without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('hide', () => {
    it('should close dialog with true when result is true', () => {
      component.hide(true);

      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should close dialog with false when result is false', () => {
      component.hide(false);

      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('should close dialog with false by default', () => {
      component.hide();

      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('deleteFolder', () => {
    it('should delete folder successfully and close dialog', () => {
      const mockResult: OperationResult = {
        success: true,
        message: ''
      };
      mockFoldersService.deleteSingleFolder.mockReturnValue(of(mockResult));

      component.deleteFolder();

      expect(mockFoldersService.deleteSingleFolder).toHaveBeenCalledWith(1);
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should not close dialog when deletion fails', () => {
      const mockResult: OperationResult = {
        success: false,
        message: 'Error deleting folder'
      };
      mockFoldersService.deleteSingleFolder.mockReturnValue(of(mockResult));

      component.deleteFolder();

      expect(mockFoldersService.deleteSingleFolder).toHaveBeenCalledWith(1);
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should handle null response', () => {
      mockFoldersService.deleteSingleFolder.mockReturnValue(of(null));

      component.deleteFolder();

      expect(mockFoldersService.deleteSingleFolder).toHaveBeenCalled();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });
});
