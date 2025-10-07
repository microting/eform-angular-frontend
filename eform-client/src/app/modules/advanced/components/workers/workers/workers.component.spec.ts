import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WorkersComponent } from './workers.component';
import { WorkersService } from 'src/app/common/services';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { WorkerDto, OperationDataResult } from 'src/app/common/models';

describe('WorkersComponent', () => {
  let component: WorkersComponent;
  let fixture: ComponentFixture<WorkersComponent>;
  let mockWorkersService: any;
  let mockDialog: any;
  let mockStore: any;
  let mockTranslateService: any;

  beforeEach(waitForAsync(() => {
    mockWorkersService = {
          getAllWorkers: jest.fn(),
        };
    mockDialog = {
          open: jest.fn(),
        };
    mockStore = {
          select: jest.fn(),
          dispatch: jest.fn(),
        };
    mockTranslateService = {
          stream: jest.fn(),
        };
    mockTranslateService.stream.mockReturnValue(of('Test'));

    // Setup store select to return observables
    mockStore.select.mockReturnValue(of(true));

    TestBed.configureTestingModule({
      declarations: [WorkersComponent],
      providers: [
        { provide: WorkersService, useValue: mockWorkersService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Store, useValue: mockStore },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: Overlay, useValue: { scrollStrategies: { reposition: () => ({}) } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadAllWorkers on initialization', () => {
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: true, message: '',
        model: []
      };
      mockWorkersService.getAllWorkers.mockReturnValue(of(mockResult));

      component.ngOnInit();

      expect(mockWorkersService.getAllWorkers).toHaveBeenCalled();
    });

    it('should add actions column when user has delete permissions', () => {
      mockStore.select.mockReturnValue(of(true));
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: true, message: '',
        model: []
      };
      mockWorkersService.getAllWorkers.mockReturnValue(of(mockResult));

      const initialHeadersCount = component.tableHeaders.length;
      component.ngOnInit();

      expect(component.tableHeaders.length).toBeGreaterThan(initialHeadersCount);
      expect(component.tableHeaders.some(h => h.field === 'actions')).toBe(true);
    });
  });

  describe('loadAllWorkers', () => {
    it('should load workers successfully', () => {
      const mockWorkers: WorkerDto[] = [
        { workerUId: 1, firstName: 'John', lastName: 'Doe' } as WorkerDto,
        { workerUId: 2, firstName: 'Jane', lastName: 'Smith' } as WorkerDto
      ];
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: true, message: '',
        model: mockWorkers
      };
      mockWorkersService.getAllWorkers.mockReturnValue(of(mockResult));

      component.loadAllWorkers();

      expect(mockWorkersService.getAllWorkers).toHaveBeenCalled();
      expect(component.workersDto).toEqual(mockWorkers);
    });

    it('should handle unsuccessful response', () => {
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: false, message: '',
        model: null
      };
      mockWorkersService.getAllWorkers.mockReturnValue(of(mockResult));

      component.loadAllWorkers();

      expect(mockWorkersService.getAllWorkers).toHaveBeenCalled();
      expect(component.workersDto).toEqual([]);
    });
  });

  describe('openCreateModal', () => {
    it('should open create modal and reload workers on success', () => {
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.mockReturnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: true, message: '',
        model: []
      };
      mockWorkersService.getAllWorkers.mockReturnValue(of(mockResult));

      component.openCreateModal();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockWorkersService.getAllWorkers).toHaveBeenCalled();
    });

    it('should not reload workers when modal is cancelled', () => {
      const mockDialogRef = {
        afterClosed: () => of(false)
      };
      mockDialog.open.mockReturnValue(mockDialogRef as any);

      mockWorkersService.getAllWorkers.mockClear();
      component.openCreateModal();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockWorkersService.getAllWorkers).not.toHaveBeenCalled();
    });
  });

  describe('openEditModal', () => {
    it('should open edit modal with selected worker', () => {
      const selectedWorker: WorkerDto = { workerUId: 1, firstName: 'John' } as WorkerDto;
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.mockReturnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: true, message: '',
        model: []
      };
      mockWorkersService.getAllWorkers.mockReturnValue(of(mockResult));

      component.openEditModal(selectedWorker);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockWorkersService.getAllWorkers).toHaveBeenCalled();
    });
  });

  describe('openDeleteModal', () => {
    it('should open delete modal with selected worker', () => {
      const selectedWorker: WorkerDto = { workerUId: 1, firstName: 'John' } as WorkerDto;
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.mockReturnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: true, message: '',
        model: []
      };
      mockWorkersService.getAllWorkers.mockReturnValue(of(mockResult));

      component.openDeleteModal(selectedWorker);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockWorkersService.getAllWorkers).toHaveBeenCalled();
    });
  });
});
