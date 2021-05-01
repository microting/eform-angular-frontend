import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PairingGridTableComponent } from './pairing-grid-table.component';

describe('PairingGridTableComponent', () => {
  let component: PairingGridTableComponent;
  let fixture: ComponentFixture<PairingGridTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PairingGridTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PairingGridTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
