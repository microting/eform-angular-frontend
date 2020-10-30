import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EformCollapseToggleComponent } from './eform-collapse-toggle.component';

describe('EformCollapseTogglerComponent', () => {
  let component: EformCollapseToggleComponent;
  let fixture: ComponentFixture<EformCollapseToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EformCollapseToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformCollapseToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
