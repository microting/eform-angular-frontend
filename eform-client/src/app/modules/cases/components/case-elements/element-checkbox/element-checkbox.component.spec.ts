/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormsModule} from '@angular/forms';
import {CasesService} from 'app/services';
import {CommonModule} from '@angular/common';
import {CasesComponent} from '../../cases.component';
import {CasesTableComponent} from '../../cases-table/cases-table.component';
import {CasesEditComponent} from '../../cases-edit/cases-edit.component';
import {CaseEditElementComponent} from '../../case-edit-element/case-edit-element.component';

import {
  ElementCheckboxComponent,
  ElementCommentComponent,
  ElementDateComponent,
  ElementMultiselectComponent,
  ElementNumberComponent,
  ElementPictureComponent,
  ElementSignatureComponent,
  ElementSingleselectComponent,
  ElementTextComponent,
  TrumbowygComponent
} from '../index';

describe('ElementCheckboxComponent', () => {
  let component: ElementCheckboxComponent;
  let fixture: ComponentFixture<ElementCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule
      ],
      declarations: [CasesComponent,
        TrumbowygComponent,
        CasesEditComponent,
        CasesTableComponent,
        CaseEditElementComponent,
        ElementCommentComponent,
        ElementMultiselectComponent,
        ElementSingleselectComponent,
        ElementNumberComponent,
        ElementTextComponent,
        ElementPictureComponent,
        ElementSignatureComponent,
        ElementCheckboxComponent,
        ElementDateComponent
      ],
      providers: [CasesService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
