import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA , EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NavigationMenuResetComponent } from './navigation-menu-reset.component';
import { MockTranslatePipe } from 'src/test-helpers';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('NavigationMenuResetComponent', () => {
  let component: NavigationMenuResetComponent;
  let fixture: ComponentFixture<NavigationMenuResetComponent>;
  let mockDialogRef: any;

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
    mockDialogRef = {
          close: vi.fn(),
        };

    TestBed.configureTestingModule({
    imports: [FormsModule, NavigationMenuResetComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: TranslateService, useValue: mockTranslateService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuResetComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
