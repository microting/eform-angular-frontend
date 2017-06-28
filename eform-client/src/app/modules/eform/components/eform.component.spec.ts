import {HttpModule} from '@angular/http';
import {RouterTestingModule} from '@angular/router/testing';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EFormComponent} from './eform.component';
import {CommonModule} from '@angular/common';
import {EFormTableComponent} from '../components/eform-table/eform-table.component';
import {EFormService} from 'app/services/eform/eform.service';
import {HelpersModule} from 'app/modules/helpers/helpers.module';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TooltipModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {SitesService} from 'app/services';


describe('EFormComponent', () => {
  let component: EFormComponent;
  let fixture: ComponentFixture<EFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HelpersModule,
        HttpModule,
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
    fixture = TestBed.createComponent(EFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
