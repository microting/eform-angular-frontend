import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';

import { NavigationMenuItemEditComponent } from './navigation-menu-item-edit.component';

describe('NavigationMenuItemEditComponent', () => {
  let component: NavigationMenuItemEditComponent;
  let fixture: ComponentFixture<NavigationMenuItemEditComponent>;

  beforeEach(waitForAsync(() => {
    const mockDialogRef = {
      close: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [ NavigationMenuItemEditComponent, MockTranslatePipe ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { model: { translations: [] }, firstLevelIndex: 0, securityGroups: [] } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display icon preview when icon is set', () => {
    component.item.icon = 'home';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const iconPreview = compiled.querySelector('#editIconPreview');
    
    expect(iconPreview).toBeTruthy();
    expect(iconPreview.textContent.trim()).toBe('home');
  });

  it('should not display icon preview when icon is not set', () => {
    component.item.icon = '';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const iconPreview = compiled.querySelector('#editIconPreview');
    
    expect(iconPreview).toBeFalsy();
  });

  describe('link checks (#8103)', () => {
    // The TestBed router has no routes, so every internal link matches none.
    beforeEach(() => {
      component.item = {...component.item, type: component.menuItemType.Link, isInternalLink: true};
    });

    it('warns about an internal link that matches no route', () => {
      component.item.link = '/no-such-page';
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('#editLinkNoRouteWarning')).toBeTruthy();
    });

    it('does not check an external link', () => {
      component.item.link = 'https://example.com';
      component.item.isInternalLink = false;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('#editLinkNoRouteWarning')).toBeFalsy();
    });

    it('does not warn about a menu template\'s default link', () => {
      component.item.link = '/plugins/example-pn/overview';
      component.menuTemplates = [
        {id: 1, name: 'Main application', collapsed: false, items: []},
        {id: 7, name: 'Example plugin', collapsed: false, items: [
          {id: 42, name: 'Overview', link: '/plugins/example-pn/overview', collapsed: false, translations: []},
        ]},
      ];
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('#editLinkNoRouteWarning')).toBeFalsy();
    });

    it('restores the default link of the plugin template item', () => {
      component.item.link = 'example-pn/overview';
      component.defaultLinkItem = {id: 42, name: 'Overview', link: '/plugins/example-pn/overview', collapsed: false, translations: []};
      fixture.detectChanges();
      const restoreBtn: HTMLButtonElement = fixture.nativeElement.querySelector('#editLinkRestoreDefaultBtn');
      expect(restoreBtn).toBeTruthy();
      restoreBtn.click();
      fixture.detectChanges();
      expect(component.item.link).toBe('/plugins/example-pn/overview');
      expect(fixture.nativeElement.querySelector('#editLinkRestoreDefaultBtn')).toBeFalsy();
    });
  });
});
