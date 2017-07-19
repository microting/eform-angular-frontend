import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap';

import {CommonModule} from '@angular/common';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {RouterTestingModule} from '@angular/router/testing';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SitesComponent} from './sites.component';
import {SitesService, UnitsService, WorkersService} from 'app/services';
import {HelpersModule} from 'app/modules/helpers/helpers.module';
import {NotifyService} from 'app/services/notify.service';

describe('SitesComponent', () => {
  let component: SitesComponent;
  let fixture: ComponentFixture<SitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        RouterTestingModule,
        TooltipModule.forRoot(),
        Ng2Bs3ModalModule,
        HelpersModule
      ],
      providers: [UnitsService, WorkersService, SitesService, NotifyService],
      declarations: [SitesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
