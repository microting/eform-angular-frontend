import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UnitsComponent } from './units.component';
import { UnitsService } from 'src/app/common/services';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { UnitDto, OperationDataResult } from 'src/app/common/models';

describe('UnitsComponent', () => {
  let component: UnitsComponent;
  let fixture: ComponentFixture<UnitsComponent>;
  let mockUnitsService: jasmine.SpyObj<UnitsService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  beforeEach(waitForAsync(() => {
    mockUnitsService = jasmine.createSpyObj('UnitsService', ['getAllUnits']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['stream']);
    mockTranslateService.stream.and.returnValue(of('Test'));

    TestBed.configureTestingModule({
      declarations: [UnitsComponent],
      providers: [
        { provide: UnitsService, useValue: mockUnitsService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Store, useValue: mockStore },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: Overlay, useValue: { scrollStrategies: { reposition: () => ({}) } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadAllUnits on initialization', () => {
      const mockResult: OperationDataResult<Array<UnitDto>> = {
        success: true, message: '',
        model: []
      };
      mockUnitsService.getAllUnits.and.returnValue(of(mockResult));

      component.ngOnInit();

      expect(mockUnitsService.getAllUnits).toHaveBeenCalled();
    });
  });

  describe('loadAllUnits', () => {
    it('should load units successfully', () => {
      const mockUnits: UnitDto[] = [
        { id: 1, microtingUid: 123, siteName: 'Site 1' } as UnitDto,
        { id: 2, microtingUid: 456, siteName: 'Site 2' } as UnitDto
      ];
      const mockResult: OperationDataResult<Array<UnitDto>> = {
        success: true, message: '',
        model: mockUnits
      };
      mockUnitsService.getAllUnits.and.returnValue(of(mockResult));

      component.loadAllUnits();

      expect(mockUnitsService.getAllUnits).toHaveBeenCalled();
      expect(component.unitModels).toEqual(mockUnits);
    });

    it('should handle unsuccessful response', () => {
      const mockResult: OperationDataResult<Array<UnitDto>> = {
        success: false, message: '',
        model: null
      };
      mockUnitsService.getAllUnits.and.returnValue(of(mockResult));

      component.loadAllUnits();

      expect(mockUnitsService.getAllUnits).toHaveBeenCalled();
      expect(component.unitModels).toEqual([]);
    });
  });

  describe('openCreateModal', () => {
    it('should open create modal and reload units on success', () => {
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<UnitDto>> = {
        success: true, message: '',
        model: []
      };
      mockUnitsService.getAllUnits.and.returnValue(of(mockResult));

      component.openCreateModal();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockUnitsService.getAllUnits).toHaveBeenCalled();
    });

    it('should not reload units when modal is cancelled', () => {
      const mockDialogRef = {
        afterClosed: () => of(false)
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      mockUnitsService.getAllUnits.calls.reset();
      component.openCreateModal();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockUnitsService.getAllUnits).not.toHaveBeenCalled();
    });
  });

  describe('openMoveModal', () => {
    it('should open move modal with selected unit', () => {
      const selectedUnit: UnitDto = { id: 1, microtingUid: 123 } as UnitDto;
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<UnitDto>> = {
        success: true, message: '',
        model: []
      };
      mockUnitsService.getAllUnits.and.returnValue(of(mockResult));

      component.openMoveModal(selectedUnit);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockUnitsService.getAllUnits).toHaveBeenCalled();
    });
  });

  describe('openModalUnitsOtpCode', () => {
    it('should open OTP code modal with selected unit', () => {
      const selectedUnit: UnitDto = { id: 1, microtingUid: 123 } as UnitDto;
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);
      
      const mockResult: OperationDataResult<Array<UnitDto>> = {
        success: true, message: '',
        model: []
      };
      mockUnitsService.getAllUnits.and.returnValue(of(mockResult));

      component.openModalUnitsOtpCode(selectedUnit);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockUnitsService.getAllUnits).toHaveBeenCalled();
    });
  });
});
