import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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
  let mockWorkersService: jasmine.SpyObj<WorkersService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  beforeEach(waitForAsync(() => {
    mockWorkersService = jasmine.createSpyObj('WorkersService', ['getAllWorkers']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['stream']);
    mockTranslateService.stream.and.returnValue(of('Test'));

    // Setup store select to return observables
    mockStore.select.and.returnValue(of(true));

    TestBed.configureTestingModule({
      declarations: [WorkersComponent],
      providers: [
        { provide: WorkersService, useValue: mockWorkersService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Store, useValue: mockStore },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: Overlay, useValue: {} }
      ]
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
      mockWorkersService.getAllWorkers.and.returnValue(of(mockResult));

      component.ngOnInit();

      expect(mockWorkersService.getAllWorkers).toHaveBeenCalled();
    });

    it('should add actions column when user has delete permissions', () => {
      mockStore.select.and.returnValue(of(true));
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: true, message: '',
        model: []
      };
      mockWorkersService.getAllWorkers.and.returnValue(of(mockResult));

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
      mockWorkersService.getAllWorkers.and.returnValue(of(mockResult));

      component.loadAllWorkers();

      expect(mockWorkersService.getAllWorkers).toHaveBeenCalled();
      expect(component.workersDto).toEqual(mockWorkers);
    });

    it('should handle unsuccessful response', () => {
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: false, message: '',
        model: null
      };
      mockWorkersService.getAllWorkers.and.returnValue(of(mockResult));

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
      mockDialog.open.and.returnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: true, message: '',
        model: []
      };
      mockWorkersService.getAllWorkers.and.returnValue(of(mockResult));

      component.openCreateModal();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockWorkersService.getAllWorkers).toHaveBeenCalled();
    });

    it('should not reload workers when modal is cancelled', () => {
      const mockDialogRef = {
        afterClosed: () => of(false)
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      mockWorkersService.getAllWorkers.calls.reset();
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
      mockDialog.open.and.returnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: true, message: '',
        model: []
      };
      mockWorkersService.getAllWorkers.and.returnValue(of(mockResult));

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
      mockDialog.open.and.returnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<WorkerDto>> = {
        success: true, message: '',
        model: []
      };
      mockWorkersService.getAllWorkers.and.returnValue(of(mockResult));

      component.openDeleteModal(selectedWorker);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockWorkersService.getAllWorkers).toHaveBeenCalled();
    });
  });
});
