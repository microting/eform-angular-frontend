import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {TooltipModule} from 'ngx-bootstrap';
import {HelpersModule, NotifyService} from '../../../helpers/helpers.module';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SiteEditComponent} from './site-edit.component';
import {SitesService, UnitsService, WorkersService} from 'app/services';

describe('SiteEditComponent', () => {
  let component: SiteEditComponent;
  let fixture: ComponentFixture<SiteEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        HttpModule,
        TooltipModule.forRoot(),
        Ng2Bs3ModalModule,
        HelpersModule
      ],
      providers: [UnitsService, WorkersService, SitesService, NotifyService],
      declarations: [SiteEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
