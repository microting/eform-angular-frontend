import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { NavigationMenuCustomComponent } from './navigation-menu-custom.component';

describe('NavigationMenuCustomComponent', () => {
  let component: NavigationMenuCustomComponent;
  let fixture: ComponentFixture<NavigationMenuCustomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ NavigationMenuCustomComponent, MockTranslatePipe ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuCustomComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
