import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CasePostsPageComponent } from './case-posts-page.component';

describe('CasePostsPageComponent', () => {
  let component: CasePostsPageComponent;
  let fixture: ComponentFixture<CasePostsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CasePostsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePostsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
