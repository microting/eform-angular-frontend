import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA , EventEmitter } from '@angular/core';
import { UnitCreateComponent } from './unit-create.component';
import { UnitsService } from 'src/app/common/services';
import { DeviceUserService } from 'src/app/common/services/device-users';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UnitModel, SiteDto, DeviceUserRequestModel, OperationResult, OperationDataResult } from 'src/app/common/models';
import { MockTranslatePipe } from 'src/test-helpers';
import { TranslateService } from '@ngx-translate/core';

describe('UnitCreateComponent', () => {
  let component: UnitCreateComponent;
  let fixture: ComponentFixture<UnitCreateComponent>;
  let mockUnitsService: any;
  let mockDeviceUserService: any;
  let mockDialogRef: any;

  beforeEach(async () => {
    const mockTranslateService = {
      instant: vi.fn((key: string) => key),
      get: vi.fn((key: string) => of(key)),
      use: vi.fn(() => of(null)),
      setDefaultLang: vi.fn(),
      getDefaultLang: vi.fn(() => 'en'),
      addLangs: vi.fn(),
      getLangs: vi.fn(() => ['en']),
      getBrowserLang: vi.fn(() => 'en'),
      getBrowserCultureLang: vi.fn(() => 'en'),
      currentLang: 'en',
      defaultLang: 'en',
      stream: vi.fn((key: string) => of(key)),
      getParsedResult: vi.fn((translations: any, key: string) => key),
      getCurrentLang: vi.fn(() => 'en'),
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter()
    };
    mockUnitsService = {
          createUnit: vi.fn(),
        };
    mockDeviceUserService = {
          getDeviceUsersFiltered: vi.fn(),
        };
    mockDialogRef = {
          close: vi.fn(),
        };

    TestBed.configureTestingModule({
    imports: [FormsModule, UnitCreateComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: UnitsService, useValue: mockUnitsService },
        { provide: DeviceUserService, useValue: mockDeviceUserService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: TranslateService, useValue: mockTranslateService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitCreateComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
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

      expect(mockDeviceUserService.getDeviceUsersFiltered).toHaveBeenCalledWith(expect.any(DeviceUserRequestModel));
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
