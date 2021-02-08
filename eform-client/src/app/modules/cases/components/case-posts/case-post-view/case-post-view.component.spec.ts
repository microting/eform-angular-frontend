import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CasePostViewComponent } from './case-post-view.component';

describe('CasePostViewComponent', () => {
  let component: CasePostViewComponent;
  let fixture: ComponentFixture<CasePostViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CasePostViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePostViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
