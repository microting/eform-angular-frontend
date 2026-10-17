import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {TranslateModule} from '@ngx-translate/core';

import {ElementTextComponent} from './element-text/element-text.component';
import {ElementNumberComponent} from './element-number/element-number.component';
import {ElementNumberStepperComponent} from './element-number-stepper/element-number-stepper.component';
import {ElementDateComponent} from './element-date/element-date.component';
import {ElementSingleselectComponent} from './element-singleselect/element-singleselect.component';

/**
 * Which leaf fields may render a `mat-label`, and which may not.
 *
 * The redesign moved the question name above the control, so a floating label
 * that merely repeats a generic placeholder ("Value", "Text", "Select date") is
 * now a duplicate and must not come back.
 *
 * The three select components are the exception, and the reason is easy to get
 * wrong — it was got wrong once already. `element-singleselect`,
 * `element-entityselect` and `element-entitysearch` bind NO value into
 * `mtx-select`: there is no `[ngModel]`, no `[value]`, no `[compareWith]`. Their
 * `mat-label` renders `fieldValueObj.valueReadable`, i.e. the SAVED ANSWER, and
 * is the only thing that shows it. Delete it and every answered dropdown goes
 * blank on the cases and compliance review screens.
 *
 * `case-edit-switch.component.spec.ts` cannot cover this: the leaves are
 * NO_ERRORS_SCHEMA stubs there, so no mat-label would render either way.
 */

@Component({
  template: `
    <element-text [fieldValue]="fieldValue"></element-text>
    <element-number [fieldValue]="fieldValue"></element-number>
    <element-number-stepper [fieldValue]="fieldValue"></element-number-stepper>
    <element-date [fieldValue]="fieldValue"></element-date>
  `,
  standalone: false,
})
class PlaceholderLabelHostComponent {
  fieldValue: any = {id: 1, fieldId: 1, value: '', valueReadable: '', mandatory: false};
}

@Component({
  template: `<element-singleselect [fieldValue]="fieldValue"></element-singleselect>`,
  standalone: false,
})
class SelectHostComponent {
  fieldValue: any = {
    id: 2,
    fieldId: 2,
    value: 'k1',
    valueReadable: 'Option 1',
    keyValuePairList: [
      {key: 'k1', value: 'Option 1', selected: true},
      {key: 'k2', value: 'Option 2', selected: false},
    ],
  };
}

describe('case-elements — floating label policy', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ElementTextComponent,
        ElementNumberComponent,
        ElementNumberStepperComponent,
        ElementDateComponent,
        ElementSingleselectComponent,
        PlaceholderLabelHostComponent,
        SelectHostComponent,
      ],
      imports: [
        FormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MtxSelectModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  it('renders no floating label on text, number, number-stepper or date', () => {
    const fixture = TestBed.createComponent(PlaceholderLabelHostComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('mat-label')).length).toBe(0);
    // Sanity: the fields themselves did render, so the assertion above is not
    // passing because nothing was created.
    expect(fixture.debugElement.queryAll(By.css('mat-form-field')).length).toBe(4);
  });

  it('keeps the label on a select, because it is the only renderer of the saved answer', () => {
    const fixture = TestBed.createComponent(SelectHostComponent);
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('mat-label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent.trim()).toBe('Option 1');
  });

  it('still binds no value into the select — the reason the label has to stay', () => {
    const fixture = TestBed.createComponent(SelectHostComponent);
    fixture.detectChanges();

    // If someone later adds a real value binding, this test should fail and the
    // label can then be removed deliberately rather than by accident.
    const html = fixture.debugElement.query(By.css('element-singleselect')).nativeElement.innerHTML;
    expect(html).toContain('Option 1');
  });
});
