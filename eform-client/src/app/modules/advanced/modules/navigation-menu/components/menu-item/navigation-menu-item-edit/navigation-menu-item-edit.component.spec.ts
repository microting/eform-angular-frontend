import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { NavigationMenuItemEditComponent } from './navigation-menu-item-edit.component';

describe.skip('NavigationMenuItemEditComponent', () => {
  let component: NavigationMenuItemEditComponent;
  let fixture: ComponentFixture<NavigationMenuItemEditComponent>;

  beforeEach(async () => {
    const mockTranslateService = {
      instant: vi.fn((key: string) => key),
      get: vi.fn((key: string) => of(key)),
      use: vi.fn(() => of(null)),
      setDefaultLang: vi.fn(),
      currentLang: 'en',
      stream: vi.fn((key: string) => of(key)),
      getParsedResult: vi.fn((translations: any, key: string) => key),
      getCurrentLang: vi.fn(() => 'en'),
      onLangChange: of({ lang: 'en', translations: {} }),
      onTranslationChange: of({ lang: 'en', translations: {} }),
      onDefaultLangChange: of({ lang: 'en', translations: {} })
    };
    const mockDialogRef = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
    imports: [FormsModule, NavigationMenuItemEditComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { model: { translations: [] }, firstLevelIndex: 0, securityGroups: [] } },
        { provide: TranslateService, useValue: mockTranslateService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuItemEditComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
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
});
