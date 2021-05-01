import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PairingGridUpdateComponent } from './pairing-grid-update.component';

describe('PairingGridUpdateComponent', () => {
  let component: PairingGridUpdateComponent;
  let fixture: ComponentFixture<PairingGridUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PairingGridUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PairingGridUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
