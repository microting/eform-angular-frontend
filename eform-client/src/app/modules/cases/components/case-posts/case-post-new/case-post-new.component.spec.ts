import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CasePostNewComponent } from './case-post-new.component';

describe('CasePostNewComponent', () => {
  let component: CasePostNewComponent;
  let fixture: ComponentFixture<CasePostNewComponent>;

  beforeEach(waitForAsync(() => {
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
