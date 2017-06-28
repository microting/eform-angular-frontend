/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EntitySearchPaginationComponent} from './entity-search-pagination.component';

describe('EntitySearchPaginationComponent', () => {
  let component: EntitySearchPaginationComponent;
  let fixture: ComponentFixture<EntitySearchPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntitySearchPaginationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitySearchPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
