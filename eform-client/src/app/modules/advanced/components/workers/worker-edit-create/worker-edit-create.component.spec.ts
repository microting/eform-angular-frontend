import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WorkerEditCreateComponent } from './worker-edit-create.component';
import { WorkersService, DeviceUserService } from 'src/app/common/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { WorkerDto, CommonDictionaryModel, OperationDataResult, OperationResult } from 'src/app/common/models';
import { MockTranslatePipe } from 'src/test-helpers';

describe('WorkerEditCreateComponent', () => {
  let component: WorkerEditCreateComponent;
  let fixture: ComponentFixture<WorkerEditCreateComponent>;
  let mockWorkersService: jasmine.SpyObj<WorkersService>;
  let mockDeviceUserService: jasmine.SpyObj<DeviceUserService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<WorkerEditCreateComponent>>;
  let mockDialogData: WorkerDto;

  beforeEach(waitForAsync(() => {
    mockWorkersService = jasmine.createSpyObj('WorkersService', ['createWorker', 'updateSingleWorker']);
    mockDeviceUserService = jasmine.createSpyObj('DeviceUserService', ['getCommonDictionarySites', 'getSingleSimpleSite']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockDialogData = new WorkerDto();

    TestBed.configureTestingModule({
      declarations: [WorkerEditCreateComponent, MockTranslatePipe],
      providers: [
        { provide: WorkersService, useValue: mockWorkersService },
        { provide: DeviceUserService, useValue: mockDeviceUserService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerEditCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set edit to false for new worker', () => {
    const newWorker = new WorkerDto();
    mockDialogData = newWorker;

    fixture = TestBed.createComponent(WorkerEditCreateComponent);
    component = fixture.componentInstance;

    expect(component.edit).toBe(false);
  });

  it('should set edit to true for existing worker', () => {
    const existingWorker = new WorkerDto();
    existingWorker.workerUId = 123;
    
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [WorkerEditCreateComponent],
      providers: [
        { provide: WorkersService, useValue: mockWorkersService },
        { provide: DeviceUserService, useValue: mockDeviceUserService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: existingWorker }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkerEditCreateComponent);
    component = fixture.componentInstance;

    expect(component.edit).toBe(true);
  });

  describe('ngOnInit', () => {
    it('should call loadAllSimpleSites on initialization', () => {
      const mockSites: CommonDictionaryModel[] = [];
      const mockResult: OperationDataResult<Array<CommonDictionaryModel>> = {
        success: true, message: '',
        model: mockSites
      };
      mockDeviceUserService.getCommonDictionarySites.and.returnValue(of(mockResult));

      component.ngOnInit();

      expect(mockDeviceUserService.getCommonDictionarySites).toHaveBeenCalled();
    });
  });

  describe('loadAllSimpleSites', () => {
    it('should load sites successfully', () => {
      const mockSites: CommonDictionaryModel[] = [
        { id: 1, name: 'Site 1' } as CommonDictionaryModel,
        { id: 2, name: 'Site 2' } as CommonDictionaryModel
      ];
      const mockResult: OperationDataResult<Array<CommonDictionaryModel>> = {
        success: true, message: '',
        model: mockSites
      };
      mockDeviceUserService.getCommonDictionarySites.and.returnValue(of(mockResult));

      component.loadAllSimpleSites();

      expect(mockDeviceUserService.getCommonDictionarySites).toHaveBeenCalled();
      expect(component.simpleSites).toEqual(mockSites);
    });

    it('should handle unsuccessful response', () => {
      const mockResult: OperationDataResult<Array<CommonDictionaryModel>> = {
        success: false, message: '',
        model: null
      };
      mockDeviceUserService.getCommonDictionarySites.and.returnValue(of(mockResult));

      component.loadAllSimpleSites();

      expect(component.simpleSites).toEqual([]);
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

  describe('createWorker', () => {
    it('should create worker successfully and close dialog', () => {
      component.workerModel.firstName = 'John';
      component.workerModel.lastName = 'Doe';
      component.workerModel.workerUId = 123;

      const mockSiteResult: OperationDataResult<any> = {
        success: true, message: '',
        model: { customerNo: 456 }
      };
      mockDeviceUserService.getSingleSimpleSite.and.returnValue(of(mockSiteResult));

      const mockCreateResult: OperationResult = {
        success: true, message: "" };
      mockWorkersService.createWorker.and.returnValue(of(mockCreateResult));

      component.createWorker();

      expect(mockDeviceUserService.getSingleSimpleSite).toHaveBeenCalledWith(123);
      expect(mockWorkersService.createWorker).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should not close dialog when creation fails', () => {
      component.workerModel.workerUId = 123;

      const mockSiteResult: OperationDataResult<any> = {
        success: true, message: '',
        model: { customerNo: 456 }
      };
      mockDeviceUserService.getSingleSimpleSite.and.returnValue(of(mockSiteResult));

      const mockCreateResult: OperationResult = {
        success: false, message: "" };
      mockWorkersService.createWorker.and.returnValue(of(mockCreateResult));

      component.createWorker();

      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('updateSingle', () => {
    it('should update worker successfully and close dialog', () => {
      component.workerModel.firstName = 'John';
      component.workerModel.lastName = 'Doe';
      component.workerModel.workerUId = 123;

      const mockResult: OperationResult = {
        success: true, message: "" };
      mockWorkersService.updateSingleWorker.and.returnValue(of(mockResult));

      component.updateSingle();

      expect(mockWorkersService.updateSingleWorker).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should not close dialog when update fails', () => {
      component.workerModel.workerUId = 123;

      const mockResult: OperationResult = {
        success: false, message: "" };
      mockWorkersService.updateSingleWorker.and.returnValue(of(mockResult));

      component.updateSingle();

      expect(mockWorkersService.updateSingleWorker).toHaveBeenCalled();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });
});
