import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPostsComponent } from './report-posts.component';

describe('ReportPostsComponent', () => {
  let component: ReportPostsComponent;
  let fixture: ComponentFixture<ReportPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
