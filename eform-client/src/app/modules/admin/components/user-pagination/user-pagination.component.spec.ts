/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserPaginationComponent} from './user-pagination.component';

describe('UserPaginationComponent', () => {
  let component: UserPaginationComponent;
  let fixture: ComponentFixture<UserPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserPaginationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
