import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {TooltipModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WorkersComponent} from './workers.component';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {SitesService, UnitsService, WorkersService} from 'app/services';
import {HelpersModule} from 'app/modules/helpers/helpers.module';
import {NotifyService} from 'app/services/notify.service';

describe('WorkersComponent', () => {
  let component: WorkersComponent;
  let fixture: ComponentFixture<WorkersComponent>;

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
      declarations: [WorkersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
