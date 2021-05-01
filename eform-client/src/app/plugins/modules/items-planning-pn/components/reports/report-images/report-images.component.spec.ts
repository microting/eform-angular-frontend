import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportImagesComponent } from './report-images.component';

describe('ReportImagesComponent', () => {
  let component: ReportImagesComponent;
  let fixture: ComponentFixture<ReportImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
