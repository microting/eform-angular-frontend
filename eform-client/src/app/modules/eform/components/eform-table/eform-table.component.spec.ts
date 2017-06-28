import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
import {EFormComponent} from '../eform.component';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EFormTableComponent} from './eform-table.component';
import {CommonModule} from '@angular/common';
import {EFormService} from 'app/services/eform/eform.service';
import {HelpersModule} from 'app/modules/helpers/helpers.module';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TooltipModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {SitesService} from 'app/services';


describe('EFormTableComponent', () => {
  let component: EFormTableComponent;
  let fixture: ComponentFixture<EFormTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpModule,
        HelpersModule,
        Ng2Bs3ModalModule,
        RouterTestingModule,
        TooltipModule.forRoot(),
        FormsModule,
      ],
      declarations: [EFormTableComponent, EFormComponent
      ],
      providers: [EFormService, SitesService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EFormTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
