import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasePostNewComponent } from './case-post-new.component';

describe('CasePostNewComponent', () => {
  let component: CasePostNewComponent;
  let fixture: ComponentFixture<CasePostNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasePostNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePostNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
