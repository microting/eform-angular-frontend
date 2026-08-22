import {Component, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CaseEditSwitchComponent} from './case-edit-switch.component';
import {DataItemDto} from 'src/app/common/models';

/**
 * Structural contract of the redesigned eForm question block.
 *
 * These assertions exist because the block replaced a mat-card with a tinted
 * mat-card-header, and because seven leaf components lost a duplicated
 * mat-label. Nothing else in the repo covers this markup: no Playwright spec
 * references a case-elements id or mat-card-header.
 */

@Component({selector: 'element-picture', template: '', standalone: false})
class StubPictureComponent {
  @Input() fieldValues: any;
  @Input() fieldId: any;
}

function makeDataItem(overrides: Partial<DataItemDto> = {}): DataItemDto {
  return {
    id: 1,
    label: 'Aflæsning',
    description: {inderValue: ''},
    color: '',
    fieldType: 'Number',
    fieldValues: [{id: 10, fieldId: 1, value: '', valueReadable: ''}],
    dataItemList: [],
    ...overrides,
  } as unknown as DataItemDto;
}

describe('CaseEditSwitchComponent', () => {
  let fixture: ComponentFixture<CaseEditSwitchComponent>;
  let component: CaseEditSwitchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseEditSwitchComponent, StubPictureComponent],
      // Every other leaf component is an unknown element here; we assert on the
      // block around them, not on their internals.
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseEditSwitchComponent);
    component = fixture.componentInstance;
  });

  function render(items: DataItemDto[]) {
    component.dataItemList = items;
    fixture.detectChanges();
  }

  // U1
  it('renders the data item label as the block label', () => {
    render([makeDataItem({label: 'Aflæsning'})]);
    const label = fixture.debugElement.query(By.css('.eform-field__label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent.trim()).toBe('Aflæsning');
  });

  // U2
  it('renders the description only when there is one', () => {
    render([makeDataItem({description: {inderValue: 'Angiv målerstand'} as any})]);
    const desc = fixture.debugElement.query(By.css('.eform-field__desc'));
    expect(desc).toBeTruthy();
    expect(desc.nativeElement.textContent.trim()).toBe('Angiv målerstand');
  });

  it('omits the description element when the description is empty', () => {
    render([makeDataItem({description: {inderValue: ''} as any})]);
    expect(fixture.debugElement.query(By.css('.eform-field__desc'))).toBeNull();
  });

  // U3 — dataItem.color survives as the accent bar, not a tinted header.
  it('marks the block accented and exposes the colour as a custom property', () => {
    render([makeDataItem({color: 'E2E5F2'})]);
    const block = fixture.debugElement.query(By.css('.eform-field'));
    expect(block.nativeElement.classList).toContain('eform-field--accented');
    expect(block.nativeElement.style.getPropertyValue('--eform-field-accent')).toBe('#E2E5F2');
  });

  // U4
  it('leaves an uncoloured block unaccented so it stays flush left', () => {
    render([makeDataItem({color: ''})]);
    const block = fixture.debugElement.query(By.css('.eform-field'));
    expect(block.nativeElement.classList).not.toContain('eform-field--accented');
    expect(block.nativeElement.style.getPropertyValue('--eform-field-accent')).toBe('');
  });

  // U5 — the regression this redesign exists to prevent.
  it('renders no mat-card-header for any field type', () => {
    render([
      makeDataItem({fieldType: 'Number'}),
      makeDataItem({fieldType: 'Text'}),
      makeDataItem({fieldType: 'Date'}),
      makeDataItem({fieldType: 'Comment'}),
    ]);
    expect(fixture.debugElement.query(By.css('mat-card-header'))).toBeNull();
    expect(fixture.debugElement.query(By.css('mat-card'))).toBeNull();
  });

  // U7
  it('renders nothing for a SaveButton field', () => {
    render([makeDataItem({fieldType: 'SaveButton'})]);
    expect(fixture.debugElement.query(By.css('.eform-field'))).toBeNull();
  });

  // U8 — a FieldContainer is a grouping construct; it keeps its own heading.
  it('renders a FieldContainer without a block label of its own', () => {
    render([makeDataItem({fieldType: 'FieldContainer', label: 'Gruppe', color: 'ABCDEF'})]);
    expect(fixture.debugElement.query(By.css('.eform-field__label'))).toBeNull();
    expect(fixture.debugElement.query(By.css('element-container'))).toBeTruthy();
    // A container must not draw an accent bar around the whole group either.
    const block = fixture.debugElement.query(By.css('.eform-field'));
    expect(block.nativeElement.classList).not.toContain('eform-field--accented');
  });

  // U9 — table-driven, so the 14 field types the calendar eForm never exercises
  // are still proven to render.
  const CASES: Array<[string, string]> = [
    ['Picture', 'element-picture'],
    ['CheckBox', 'element-checkbox'],
    ['Number', 'element-number'],
    ['NumberStepper', 'element-number-stepper'],
    ['Comment', 'element-comment'],
    ['Text', 'element-text'],
    ['Date', 'element-date'],
    ['SingleSelect', 'element-singleselect'],
    ['MultiSelect', 'element-multiselect'],
    ['ShowPdf', 'element-pdf'],
    ['None', 'element-infobox'],
    ['Timer', 'element-timer'],
    ['Signature', 'element-signature'],
    ['FieldContainer', 'element-container'],
    ['EntitySearch', 'element-entitysearch'],
    ['EntitySelect', 'element-entityselect'],
    ['Audio', 'element-audio'],
  ];

  it.each(CASES)('renders %s as <%s>', (fieldType, selector) => {
    render([makeDataItem({fieldType})]);
    expect(fixture.debugElement.query(By.css(selector))).toBeTruthy();
  });

  it('emits needUpdate when a picture reports an update', () => {
    const spy = jest.fn();
    component.needUpdate.subscribe(spy);
    component.emitNeedUpdate();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
