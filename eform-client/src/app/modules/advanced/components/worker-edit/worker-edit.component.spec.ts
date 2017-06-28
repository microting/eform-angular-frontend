import {HttpModule} from '@angular/http';
import {HelpersModule, NotifyService} from '../../../helpers/helpers.module';
import {RouterTestingModule} from '@angular/router/testing';
import {TooltipModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';

import {WorkerEditComponent} from './worker-edit.component';
import {SitesService, UnitsService, WorkersService} from 'app/services';

describe('WorkerEditComponent', () => {
  let component: WorkerEditComponent;
  let fixture: ComponentFixture<WorkerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        Ng2Bs3ModalModule,
        TooltipModule.forRoot(),
        RouterTestingModule,
        HelpersModule,
        HttpModule
      ],
      providers: [UnitsService, WorkersService, SitesService, NotifyService],
      declarations: [WorkerEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
