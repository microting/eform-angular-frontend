import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PairingGridPageComponent } from './pairing-grid-page.component';

describe('PairingGridPageComponent', () => {
  let component: PairingGridPageComponent;
  let fixture: ComponentFixture<PairingGridPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PairingGridPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PairingGridPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
