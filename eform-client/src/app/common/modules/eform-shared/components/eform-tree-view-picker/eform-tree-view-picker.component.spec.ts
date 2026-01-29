import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EformTreeViewPickerComponent } from './eform-tree-view-picker.component';

describe('EformTreeViewPickerComponent', () => {
  let component: EformTreeViewPickerComponent;
  let fixture: ComponentFixture<EformTreeViewPickerComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
    imports: [FormsModule, EformTreeViewPickerComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EformTreeViewPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
