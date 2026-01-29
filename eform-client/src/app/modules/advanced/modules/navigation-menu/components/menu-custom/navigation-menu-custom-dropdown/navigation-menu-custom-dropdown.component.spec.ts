import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA , EventEmitter } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { NavigationMenuCustomDropdownComponent } from './navigation-menu-custom-dropdown.component';

describe('NavigationMenuCustomDropdownComponent', () => {
  let component: NavigationMenuCustomDropdownComponent;
  let fixture: ComponentFixture<NavigationMenuCustomDropdownComponent>;

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
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter()
    };
    const mockDialogRef = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
    imports: [FormsModule, NavigationMenuCustomDropdownComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: TranslateService, useValue: mockTranslateService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuCustomDropdownComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
