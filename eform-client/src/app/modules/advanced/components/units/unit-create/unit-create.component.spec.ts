import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UnitCreateComponent } from './unit-create.component';
import { UnitsService } from 'src/app/common/services';
import { DeviceUserService } from 'src/app/common/services/device-users';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UnitModel, SiteDto, DeviceUserRequestModel, OperationResult, OperationDataResult } from 'src/app/common/models';

describe('UnitCreateComponent', () => {
  let component: UnitCreateComponent;
  let fixture: ComponentFixture<UnitCreateComponent>;
  let mockUnitsService: any;
  let mockDeviceUserService: any;
  let mockDialogRef: any;

  beforeEach(waitForAsync(() => {
    mockUnitsService = {
          createUnit: jest.fn(),
        };
    mockDeviceUserService = {
          getDeviceUsersFiltered: jest.fn(),
        };
    mockDialogRef = {
          close: jest.fn(),
        };

    TestBed.configureTestingModule({
      declarations: [UnitCreateComponent],
      providers: [
        { provide: UnitsService, useValue: mockUnitsService },
        { provide: DeviceUserService, useValue: mockDeviceUserService },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadAllSimpleSites on initialization', () => {
      const mockSites: SiteDto[] = [
        { siteId: 1, siteName: 'Site 1' } as SiteDto,
        { siteId: 2, siteName: 'Site 2' } as SiteDto
      ];
      const mockResult: OperationDataResult<Array<SiteDto>> = {
        success: true, message: '',
        model: mockSites
      };
      mockDeviceUserService.getDeviceUsersFiltered.mockReturnValue(of(mockResult));

      component.ngOnInit();

      expect(mockDeviceUserService.getDeviceUsersFiltered).toHaveBeenCalled();
    });
  });

  describe('loadAllSimpleSites', () => {
    it('should load and transform sites correctly', () => {
      const mockSites: SiteDto[] = [
        { siteId: 1, siteName: 'Site 1', fullName: '' } as SiteDto,
        { siteId: 2, siteName: 'Site 2', fullName: '' } as SiteDto
      ];
      const mockResult: OperationDataResult<Array<SiteDto>> = {
        success: true, message: '',
        model: mockSites
      };
      mockDeviceUserService.getDeviceUsersFiltered.mockReturnValue(of(mockResult));

      component.loadAllSimpleSites();

      expect(mockDeviceUserService.getDeviceUsersFiltered).toHaveBeenCalledWith(jasmine.any(DeviceUserRequestModel));
      expect(component.simpleSites.length).toBe(2);
      expect(component.simpleSites[0].fullName).toBe('Site 1');
      expect(component.simpleSites[1].fullName).toBe('Site 2');
    });

    it('should handle empty sites response', () => {
      const mockResult: OperationDataResult<Array<SiteDto>> = {
        success: true, message: '',
        model: []
      };
      mockDeviceUserService.getDeviceUsersFiltered.mockReturnValue(of(mockResult));

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

  describe('createUnit', () => {
    it('should create unit successfully and close dialog', () => {
      const mockResult: OperationResult = {
        success: true,
        message: ''
      };
      mockUnitsService.createUnit.mockReturnValue(of(mockResult));
      component.unitModel = new UnitModel();
      component.unitModel.siteId = 1;

      component.createUnit();

      expect(mockUnitsService.createUnit).toHaveBeenCalledWith(component.unitModel);
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should not close dialog when creation fails', () => {
      const mockResult: OperationResult = {
        success: false,
        message: ''
      };
      mockUnitsService.createUnit.mockReturnValue(of(mockResult));
      component.unitModel = new UnitModel();

      component.createUnit();

      expect(mockUnitsService.createUnit).toHaveBeenCalled();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should handle null response', () => {
      mockUnitsService.createUnit.mockReturnValue(of(null));
      component.unitModel = new UnitModel();

      component.createUnit();

      expect(mockUnitsService.createUnit).toHaveBeenCalled();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });
});
