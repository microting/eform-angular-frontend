import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformsBulkImportModalComponent } from './eforms-bulk-import-modal.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/common/services/loader.service';
import { AuthStateService } from 'src/app/common/store';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('EformsBulkImportModalComponent', () => {
  let component: EformsBulkImportModalComponent;
  let fixture: ComponentFixture<EformsBulkImportModalComponent>;

  beforeEach(waitForAsync(() => {
    const mockToastrService = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    };
    const mockTranslateService = {
      instant: jest.fn((key: string) => key),
      stream: jest.fn((key: string) => of(key)),
    };
    const mockLoaderService = {
      setLoading: jest.fn(),
    };
    const mockAuthStateService = {
      connectionStringExists: jest.fn(),
    };
    const mockDialogRef = {
      close: jest.fn(),
    };
    const mockStore = {
      select: jest.fn(() => of('mock-token')),
    };

    TestBed.configureTestingModule({
      declarations: [ EformsBulkImportModalComponent, MockTranslatePipe ],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: AuthStateService, useValue: mockAuthStateService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Store, useValue: mockStore }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformsBulkImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
