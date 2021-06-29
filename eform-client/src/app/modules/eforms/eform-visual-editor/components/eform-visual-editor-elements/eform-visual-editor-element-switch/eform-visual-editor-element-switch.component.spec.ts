import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EformVisualEditorElementSwitchComponent } from './eform-visual-editor-element-switch.component';

describe('EformVisualEditorElementSwitchComponent', () => {
  let component: EformVisualEditorElementSwitchComponent;
  let fixture: ComponentFixture<EformVisualEditorElementSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EformVisualEditorElementSwitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EformVisualEditorElementSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
