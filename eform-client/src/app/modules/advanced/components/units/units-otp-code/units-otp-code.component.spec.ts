import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UnitsOtpCodeComponent } from './units-otp-code.component';
import { UnitsService } from 'src/app/common/services/advanced';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UnitDto, OperationDataResult } from 'src/app/common/models';

describe('UnitsOtpCodeComponent', () => {
  let component: UnitsOtpCodeComponent;
  let fixture: ComponentFixture<UnitsOtpCodeComponent>;
  let mockUnitsService: any;
  let mockDialogRef: any;
  let mockDialogData: UnitDto;

  beforeEach(waitForAsync(() => {
    mockUnitsService = {
          requestOtp: jest.fn(),
        };
    mockDialogRef = {
          close: jest.fn(),
        };
    mockDialogData = { id: 1, microtingUid: 12345, siteName: 'Test Site' } as UnitDto;

    TestBed.configureTestingModule({
      declarations: [UnitsOtpCodeComponent],
      providers: [
        { provide: UnitsService, useValue: mockUnitsService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsOtpCodeComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with dialog data', () => {
    expect(component.selectedUnitModel).toBeDefined();
    expect(component.selectedUnitModel.id).toBe(1);
    expect(component.selectedUnitModel.microtingUid).toBe(12345);
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

  describe('requestOtp', () => {
    it('should request OTP successfully and close dialog', () => {
      const mockUnit: UnitDto = { id: 1, microtingUid: 12345, otpCode: 6789 } as UnitDto;
      const mockResult: OperationDataResult<UnitDto> = {
        success: true, message: '',
        model: mockUnit
      };
      mockUnitsService.requestOtp.mockReturnValue(of(mockResult));

      component.requestOtp();

      expect(mockUnitsService.requestOtp).toHaveBeenCalledWith(12345);
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should not close dialog when OTP request fails', () => {
      const mockResult: OperationDataResult<UnitDto> = {
        success: false, message: '',
        model: null
      };
      mockUnitsService.requestOtp.mockReturnValue(of(mockResult));

      component.requestOtp();

      expect(mockUnitsService.requestOtp).toHaveBeenCalledWith(12345);
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should handle null response', () => {
      mockUnitsService.requestOtp.mockReturnValue(of(null));

      component.requestOtp();

      expect(mockUnitsService.requestOtp).toHaveBeenCalled();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });
});
