import { describe, it, expect, vi } from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {NavigationComponent} from './navigation.component';
import {leftAppMenus, selectAuthIsAuth, selectCurrentUserClaims} from 'src/app/state';

describe('NavigationComponent - dropdown guards', () => {
  let fixture: ComponentFixture<NavigationComponent>;

  const link = (e2EId: string, guards: string[]) =>
    ({name: e2EId, link: `/${e2EId}`, e2EId, position: 1, isInternalLink: true, guards, menuItems: []});
  const dropdown = (e2EId: string, guards: string[], menuItems: unknown[]) =>
    ({name: e2EId, link: '', e2EId, position: 1, isInternalLink: true, guards, menuItems});

  const setup = (menu: unknown[], claims: Record<string, boolean>) => {
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
      providers: [provideRouter([]), {provide: Store, useValue: store}],
    });
    fixture = TestBed.createComponent(NavigationComponent);
    fixture.detectChanges();
    fixture.detectChanges();
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
});
