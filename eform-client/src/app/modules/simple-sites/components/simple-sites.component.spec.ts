/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleSitesComponent} from './simple-sites.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('SimpleSitesComponent', () => {
  let component: SimpleSitesComponent;
  let fixture: ComponentFixture<SimpleSitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleSitesComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
