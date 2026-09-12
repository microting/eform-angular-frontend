import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, of } from 'rxjs';
import { DeviceUsersPageComponent } from './device-users-page.component';
import { DeviceUserService } from 'src/app/common/services';
import { DeviceUsersStateService } from '../store';
import { SiteDto } from 'src/app/common/models';
import {
  selectCurrentUserClaimsDeviceUsersCreate,
  selectCurrentUserClaimsDeviceUsersDelete,
  selectCurrentUserClaimsDeviceUsersUpdate,
  selectCurrentUserIsFirstUser,
} from 'src/app/state/auth/auth.selector';
import { MockMatMenuComponent, MockMtxGridComponent, MockTranslatePipe, mockStoreSelectFrom } from 'src/test-helpers';

interface AuthFixture {
  isFirstUser: boolean;
  deleteClaim: boolean;
  updateClaim?: boolean;
}

// Only the first user may delete a device user, and only while also holding the delete claim.
describe('DeviceUsersPageComponent', () => {
  let mockStore: any;
  let mockDeviceUsersStateService: any;

  beforeEach(waitForAsync(() => {
    mockStore = {
      select: jest.fn(),
      dispatch: jest.fn(),
    };
    mockDeviceUsersStateService = {
      getDeviceUsersFiltered: jest.fn(),
      updateNameFilter: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [DeviceUsersPageComponent, MockTranslatePipe, MockMtxGridComponent, MockMatMenuComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: DeviceUserService, useValue: { deleteSingleDeviceUser: jest.fn() } },
        { provide: DeviceUsersStateService, useValue: mockDeviceUsersStateService },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: TranslateService, useValue: { stream: jest.fn().mockReturnValue(of('Test')) } },
        { provide: Overlay, useValue: { scrollStrategies: { reposition: () => ({}) } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  // The component reads the store in its field initialisers, so the auth state has to be
  // in place before the component is created.
  function render(auth: AuthFixture, rows: Partial<SiteDto>[] = []): ComponentFixture<DeviceUsersPageComponent> {
    mockStoreSelectFrom(mockStore, [
      [selectCurrentUserIsFirstUser, auth.isFirstUser],
      [selectCurrentUserClaimsDeviceUsersDelete, auth.deleteClaim],
      [selectCurrentUserClaimsDeviceUsersUpdate, auth.updateClaim ?? false],
      [selectCurrentUserClaimsDeviceUsersCreate, false],
    ]);
    mockDeviceUsersStateService.getDeviceUsersFiltered.mockReturnValue(of({ success: true, model: rows }));

    const fixture = TestBed.createComponent(DeviceUsersPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  describe('selectCurrentUserCanDeleteDeviceUsers$', () => {
    it.each([
      [true, true, true],
      [true, false, false],
      [false, true, false],
      [false, false, false],
    ])('first user %s, delete claim %s: can delete is %s', async (isFirstUser, deleteClaim, expected) => {
      const fixture = render({ isFirstUser, deleteClaim }, [{ siteUid: 1, isLocked: false }]);

      expect(await firstValueFrom(fixture.componentInstance.selectCurrentUserCanDeleteDeviceUsers$)).toBe(expected);
      expect(fixture.nativeElement.querySelector('#deleteDeviceUserBtn0') !== null).toBe(expected);
    });
  });

  it('renders no row menu for a locked row, even for a first user with every claim', () => {
    const fixture = render(
      { isFirstUser: true, deleteClaim: true, updateClaim: true },
      [{ siteUid: 1, isLocked: true }, { siteUid: 2, isLocked: false }],
    );
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('#action-items-0')).toBeNull();
    // The unlocked row proves the rows are rendered at all.
    expect(el.querySelector('#action-items-1')).not.toBeNull();
    expect(el.querySelector('#deleteDeviceUserBtn1')).not.toBeNull();
  });

  it('offers no Actions column or row menu to a delete-claim holder who is not the first user', () => {
    const fixture = render({ isFirstUser: false, deleteClaim: true }, [{ siteUid: 1, isLocked: false }]);

    expect(fixture.componentInstance.tableHeaders.some(h => h.field === 'actions')).toBe(false);
    expect(fixture.nativeElement.querySelector('#action-items-0')).toBeNull();
  });
});
