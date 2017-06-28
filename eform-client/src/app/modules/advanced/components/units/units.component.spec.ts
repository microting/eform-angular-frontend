import {TooltipModule} from 'ngx-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {HelpersModule, NotifyService} from '../../../helpers/helpers.module';
import {SitesService, WorkersService} from '../../../../services';
import {HttpModule} from '@angular/http';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UnitsService} from '../../../../services/units.service';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UnitsComponent} from './units.component';

describe('UnitsComponent', () => {
  let component: UnitsComponent;
  let fixture: ComponentFixture<UnitsComponent>;

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
      declarations: [UnitsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
