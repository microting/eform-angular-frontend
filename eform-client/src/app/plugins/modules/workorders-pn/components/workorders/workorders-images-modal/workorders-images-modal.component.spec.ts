import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkordersImagesModalComponent } from './workorders-images-modal.component';

describe('WorkordersImagesModalComponent', () => {
  let component: WorkordersImagesModalComponent;
  let fixture: ComponentFixture<WorkordersImagesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkordersImagesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkordersImagesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
