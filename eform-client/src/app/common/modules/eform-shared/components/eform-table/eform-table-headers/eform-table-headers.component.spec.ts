import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EformTableHeadersComponent } from './eform-table-headers.component';

describe('EformTableHeadersComponent', () => {
  let component: EformTableHeadersComponent;
  let fixture: ComponentFixture<EformTableHeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EformTableHeadersComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EformTableHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
