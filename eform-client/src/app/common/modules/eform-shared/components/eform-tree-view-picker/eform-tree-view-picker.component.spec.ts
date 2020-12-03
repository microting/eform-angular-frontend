import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EformTreeViewPickerComponent } from './eform-tree-view-picker.component';

describe('EformTreeViewPickerComponent', () => {
  let component: EformTreeViewPickerComponent;
  let fixture: ComponentFixture<EformTreeViewPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EformTreeViewPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformTreeViewPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
