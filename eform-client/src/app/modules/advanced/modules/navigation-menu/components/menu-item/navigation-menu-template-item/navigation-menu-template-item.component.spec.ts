import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NavigationMenuTemplateItemComponent } from './navigation-menu-template-item.component';

describe('NavigationMenuTemplateItemComponent', () => {
  let component: NavigationMenuTemplateItemComponent;
  let fixture: ComponentFixture<NavigationMenuTemplateItemComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
    imports: [FormsModule, NavigationMenuTemplateItemComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuTemplateItemComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
