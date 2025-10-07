import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FoldersComponent } from './folders.component';
import { FoldersService } from 'src/app/common/services';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { FolderDto, OperationDataResult } from 'src/app/common/models';

describe('FoldersComponent', () => {
  let component: FoldersComponent;
  let fixture: ComponentFixture<FoldersComponent>;
  let mockFoldersService: any;
  let mockDialog: any;
  let mockStore: any;

  beforeEach(waitForAsync(() => {
    mockFoldersService = {
          getAllFolders: jest.fn(),
          getAllFoldersList: jest.fn(),
        };
    mockDialog = {
          open: jest.fn(),
        };
    mockStore = {
          select: jest.fn(),
          dispatch: jest.fn(),
        };
    mockStore.select.mockReturnValue(of(true));

    TestBed.configureTestingModule({
      declarations: [FoldersComponent],
      providers: [
        { provide: FoldersService, useValue: mockFoldersService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Store, useValue: mockStore },
        { provide: Overlay, useValue: { scrollStrategies: { reposition: () => ({}) } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoldersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getInitialData on initialization', () => {
      const mockResult: OperationDataResult<Array<FolderDto>> = {
        success: true,
        message: '',
        model: []
      };
      mockFoldersService.getAllFolders.mockReturnValue(of(mockResult));

      component.ngOnInit();

      expect(mockFoldersService.getAllFolders).toHaveBeenCalled();
    });
  });

  describe('getInitialData', () => {
    it('should call loadAllFolders', () => {
      const mockResult: OperationDataResult<Array<FolderDto>> = {
        success: true,
        message: '',
        model: []
      };
      mockFoldersService.getAllFolders.mockReturnValue(of(mockResult));

      component.getInitialData();

      expect(mockFoldersService.getAllFolders).toHaveBeenCalled();
    });
  });

  describe('loadAllFolders', () => {
    it('should load folders successfully', () => {
      const mockFolders: FolderDto[] = [
        { id: 1, name: 'Folder 1' } as FolderDto,
        { id: 2, name: 'Folder 2' } as FolderDto
      ];
      const mockResult: OperationDataResult<Array<FolderDto>> = {
        success: true,
        message: '',
        model: mockFolders
      };
      mockFoldersService.getAllFolders.mockReturnValue(of(mockResult));

      component.loadAllFolders();

      expect(mockFoldersService.getAllFolders).toHaveBeenCalled();
      expect(component.foldersDto).toEqual(mockFolders);
    });

    it('should handle unsuccessful response', () => {
      const mockResult: OperationDataResult<Array<FolderDto>> = {
        success: false,
        message: '',
        model: null
      };
      mockFoldersService.getAllFolders.mockReturnValue(of(mockResult));

      component.loadAllFolders();

      expect(mockFoldersService.getAllFolders).toHaveBeenCalled();
      expect(component.foldersDto).toEqual([]);
    });
  });

  describe('loadAllFoldersList', () => {
    it('should load folders list successfully', () => {
      const mockFolders: FolderDto[] = [
        { id: 1, name: 'Folder 1' } as FolderDto,
        { id: 2, name: 'Folder 2' } as FolderDto
      ];
      const mockResult: OperationDataResult<Array<FolderDto>> = {
        success: true,
        message: '',
        model: mockFolders
      };
      mockFoldersService.getAllFoldersList.mockReturnValue(of(mockResult));

      component.loadAllFoldersList();

      expect(mockFoldersService.getAllFoldersList).toHaveBeenCalled();
      expect(component.foldersFlatList).toEqual(mockFolders);
    });
  });

  describe('openCreateModal', () => {
    it('should open create modal and reload folders on success', () => {
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.mockReturnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<FolderDto>> = {
        success: true,
        message: '',
        model: []
      };
      mockFoldersService.getAllFolders.mockReturnValue(of(mockResult));

      component.openCreateModal();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockFoldersService.getAllFolders).toHaveBeenCalled();
    });

    it('should open create modal with parent folder', () => {
      const parentFolder: FolderDto = { id: 1, name: 'Parent' } as FolderDto;
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.mockReturnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<FolderDto>> = {
        success: true,
        message: '',
        model: []
      };
      mockFoldersService.getAllFolders.mockReturnValue(of(mockResult));

      component.openCreateModal(parentFolder);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockFoldersService.getAllFolders).toHaveBeenCalled();
    });

    it('should not reload folders when modal is cancelled', () => {
      const mockDialogRef = {
        afterClosed: () => of(false)
      };
      mockDialog.open.mockReturnValue(mockDialogRef as any);

      mockFoldersService.getAllFolders.mockClear();
      component.openCreateModal();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockFoldersService.getAllFolders).not.toHaveBeenCalled();
    });
  });

  describe('openEditModal', () => {
    it('should open edit modal with selected folder', () => {
      const selectedFolder: FolderDto = { id: 1, name: 'Test Folder' } as FolderDto;
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.mockReturnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<FolderDto>> = {
        success: true,
        message: '',
        model: []
      };
      mockFoldersService.getAllFolders.mockReturnValue(of(mockResult));

      component.openEditModal(selectedFolder);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockFoldersService.getAllFolders).toHaveBeenCalled();
    });
  });

  describe('openDeleteModal', () => {
    it('should open delete modal with selected folder', () => {
      const selectedFolder: FolderDto = { id: 1, name: 'Test Folder' } as FolderDto;
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.mockReturnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<FolderDto>> = {
        success: true,
        message: '',
        model: []
      };
      mockFoldersService.getAllFolders.mockReturnValue(of(mockResult));

      component.openDeleteModal(selectedFolder);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockFoldersService.getAllFolders).toHaveBeenCalled();
    });
  });
});
