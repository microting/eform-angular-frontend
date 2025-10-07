import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WorkerDeleteComponent } from './worker-delete.component';
import { WorkersService } from 'src/app/common/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { WorkerDto, OperationResult } from 'src/app/common/models';
import { MockTranslatePipe } from 'src/test-helpers';

describe('WorkerDeleteComponent', () => {
  let component: WorkerDeleteComponent;
  let fixture: ComponentFixture<WorkerDeleteComponent>;
  let mockWorkersService: any;
  let mockDialogRef: any;
  let mockDialogData: WorkerDto;

  beforeEach(waitForAsync(() => {
    mockWorkersService = {
          deleteSingleWorker: jest.fn(),
        };
    mockDialogRef = {
          close: jest.fn(),
        };
    mockDialogData = { workerUId: 123, firstName: 'John', lastName: 'Doe' } as WorkerDto;

    TestBed.configureTestingModule({
      declarations: [WorkerDeleteComponent, MockTranslatePipe],
      providers: [
        { provide: WorkersService, useValue: mockWorkersService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with dialog data', () => {
    expect(component.selectedWorkerDto).toBeDefined();
    expect(component.selectedWorkerDto.workerUId).toBe(123);
    expect(component.selectedWorkerDto.firstName).toBe('John');
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

  describe('deleteWorker', () => {
    it('should delete worker successfully and close dialog', () => {
      const mockResult: OperationResult = {
        success: true,
        message: ''
      };
      mockWorkersService.deleteSingleWorker.mockReturnValue(of(mockResult));

      component.deleteWorker();

      expect(mockWorkersService.deleteSingleWorker).toHaveBeenCalledWith(123);
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should not close dialog when deletion fails', () => {
      const mockResult: OperationResult = {
        success: false,
        message: 'Error deleting worker'
      };
      mockWorkersService.deleteSingleWorker.mockReturnValue(of(mockResult));

      component.deleteWorker();

      expect(mockWorkersService.deleteSingleWorker).toHaveBeenCalledWith(123);
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should handle null response', () => {
      mockWorkersService.deleteSingleWorker.mockReturnValue(of(null));

      component.deleteWorker();

      expect(mockWorkersService.deleteSingleWorker).toHaveBeenCalled();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });
});
