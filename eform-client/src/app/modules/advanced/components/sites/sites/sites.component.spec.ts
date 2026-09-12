import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, of } from 'rxjs';
import { SitesComponent } from './sites.component';
import { EformTagService, SitesService } from 'src/app/common/services';
import { AuthStateService } from 'src/app/common/store';
import { SiteNameDto } from 'src/app/common/models';
import {
  selectCurrentUserClaimsSitesDelete,
  selectCurrentUserClaimsSitesUpdate,
  selectCurrentUserIsFirstUser,
} from 'src/app/state/auth/auth.selector';
import { MockMatMenuComponent, MockMtxGridComponent, MockTranslatePipe } from 'src/test-helpers';

// Only the first user may delete a site (a device user), and only while also holding the delete claim.
describe('SitesComponent', () => {
  let mockStore: any;
  let mockSitesService: any;

  beforeEach(waitForAsync(() => {
    mockStore = {
      select: jest.fn(),
      dispatch: jest.fn(),
    };
    mockSitesService = {
      getAllSites: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [SitesComponent, MockTranslatePipe, MockMtxGridComponent, MockMatMenuComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: SitesService, useValue: mockSitesService },
        { provide: AuthStateService, useValue: {} },
        { provide: EformTagService, useValue: { getAvailableTags: jest.fn().mockReturnValue(of({ success: true, model: [] })) } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: TranslateService, useValue: { stream: jest.fn().mockReturnValue(of('Test')) } },
        { provide: Overlay, useValue: { scrollStrategies: { reposition: () => ({}) } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  // The component reads the store in its field initialisers, so the auth state has to be
  // in place before the component is created.
  function render(
    auth: { isFirstUser: boolean; deleteClaim: boolean; updateClaim?: boolean },
    rows: Partial<SiteNameDto>[] = [],
  ): ComponentFixture<SitesComponent> {
    const selected = new Map<unknown, unknown>([
      [selectCurrentUserIsFirstUser, auth.isFirstUser],
      [selectCurrentUserClaimsSitesDelete, auth.deleteClaim],
      [selectCurrentUserClaimsSitesUpdate, auth.updateClaim ?? false],
    ]);
    mockStore.select.mockImplementation((selector: unknown) => of(selected.get(selector)));
    mockSitesService.getAllSites.mockReturnValue(of({ success: true, model: rows }));

    const fixture = TestBed.createComponent(SitesComponent);
    fixture.detectChanges();
    return fixture;
  }

  describe('selectCurrentUserCanDeleteSites$', () => {
    it.each([
      [true, true, true],
      [true, false, false],
      [false, true, false],
      [false, false, false],
    ])('first user %s, delete claim %s: can delete is %s', async (isFirstUser, deleteClaim, expected) => {
      const fixture = render({ isFirstUser, deleteClaim }, [{ id: 1, siteUId: 1, tags: [], units: [], isLocked: false }]);

      expect(await firstValueFrom(fixture.componentInstance.selectCurrentUserCanDeleteSites$)).toBe(expected);
      expect(fixture.nativeElement.querySelector('#deleteSiteBtn0') !== null).toBe(expected);
    });
  });

  it('renders no row menu for a locked site, even for a first user with every claim', () => {
    const fixture = render(
      { isFirstUser: true, deleteClaim: true, updateClaim: true },
      [
        { id: 1, siteUId: 1, tags: [], units: [], isLocked: true },
        { id: 2, siteUId: 2, tags: [], units: [], isLocked: false },
      ],
    );
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('#action-items-0')).toBeNull();
    // The unlocked row proves the rows are rendered at all.
    expect(el.querySelector('#action-items-1')).not.toBeNull();
    expect(el.querySelector('#deleteSiteBtn1')).not.toBeNull();
  });
});
