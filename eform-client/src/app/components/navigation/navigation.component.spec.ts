import { describe, it, expect, vi } from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {provideRouter, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {NavigationComponent} from './navigation.component';
import {leftAppMenus, selectAuthIsAuth, selectCurrentUserClaims} from 'src/app/state';

describe('NavigationComponent', () => {
  let fixture: ComponentFixture<NavigationComponent>;

  const link = (e2EId: string, guards: string[]) =>
    ({name: e2EId, link: `/${e2EId}`, e2EId, position: 1, isInternalLink: true, guards, menuItems: []});
  const dropdown = (e2EId: string, guards: string[], menuItems: unknown[]) =>
    ({name: e2EId, link: '', e2EId, position: 1, isInternalLink: true, guards, menuItems});

  const configure = (menu: unknown[], claims: Record<string, boolean>) => {
    const values = new Map<unknown, unknown>([
      [selectAuthIsAuth, true],
      [selectCurrentUserClaims, claims],
      [leftAppMenus, menu],
    ]);
    const store = {
      select: vi.fn((selector: unknown) => of(values.get(selector))),
      dispatch: vi.fn(),
    };
    TestBed.configureTestingModule({
      imports: [NavigationComponent, NoopAnimationsModule],
      providers: [provideRouter([{path: '**', children: []}]), {provide: Store, useValue: store}],
    });
  };
  const render = () => {
    fixture = TestBed.createComponent(NavigationComponent);
    fixture.detectChanges();
    fixture.detectChanges();
  };
  const setup = (menu: unknown[], claims: Record<string, boolean>) => {
    configure(menu, claims);
    render();
  };

  const has = (id: string) => fixture.nativeElement.querySelector(`#${id}`) !== null;

  it('does not render a dropdown whose only child fails its guard', () => {
    setup([dropdown('crm', ['crm_access'], [link('crm-list', ['crm_access'])])], {});
    expect(has('crm')).toBe(false);
  });

  it('renders a dropdown when a child passes its guard', () => {
    setup([dropdown('crm', ['crm_access'], [link('crm-list', ['crm_access'])])], {crmAccess: true});
    expect(has('crm')).toBe(true);
  });

  it('still renders a dropdown that has no guards', () => {
    setup([dropdown('plain', [], [link('plain-child', [])])], {});
    expect(has('plain')).toBe(true);
  });

  describe('highlight', () => {
    const menuWithHome = (homeLink: string) => [{...link('home', []), link: homeLink}, link('companies', [])];
    const settle = async () => {
      await fixture.whenStable();
      // Zoneless tests only refresh a marked view. The app refreshes it on every navigation.
      fixture.changeDetectorRef.markForCheck();
      await fixture.whenStable();
    };
    const highlighted = () =>
      Array.from(fixture.nativeElement.querySelectorAll('a.selected-node'), (a: Element) => a.id);
    const openOn = async (homeLink: string, url: string) => {
      configure(menuWithHome(homeLink), {});
      await TestBed.inject(Router).navigateByUrl(url);
      render();
      await settle();
    };
    const goTo = async (url: string) => {
      await TestBed.inject(Router).navigateByUrl(url);
      await settle();
    };

    it.each(['/', '', '//'])('highlights home link "%s" on the home page', async homeLink => {
      await openOn(homeLink, '/');
      expect(highlighted()).toEqual(['home']);
    });

    it.each(['/', '', '//'])('does not highlight home link "%s" when another page loads', async homeLink => {
      await openOn(homeLink, '/companies');
      expect(highlighted()).toEqual(['companies']);
    });

    it('moves the highlight away from home and back', async () => {
      await openOn('/', '/');
      await goTo('/companies');
      expect(highlighted()).toEqual(['companies']);
      await goTo('/');
      expect(highlighted()).toEqual(['home']);
    });

    it('keeps the home link highlighted when a query string is added', async () => {
      await openOn('/', '/');
      await goTo('/?page=2');
      expect(highlighted()).toEqual(['home']);
    });

    it('keeps another link highlighted from its page to a sub-page', async () => {
      await openOn('/', '/companies');
      await goTo('/companies/5');
      expect(highlighted()).toEqual(['companies']);
    });

    it('highlights nothing on a page below home that has no link of its own', async () => {
      await openOn('/', '/visual-editor');
      expect(highlighted()).toEqual([]);
    });
  });
});
