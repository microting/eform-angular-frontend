import { describe, it, expect, beforeEach, vi } from 'vitest';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MatRadioButton, MatRadioGroup, MatRadioModule} from '@angular/material/radio';
import {CaseEditElementComponent} from './case-edit-element.component';
import {ElementDto} from 'src/app/common/models';

// ng-gallery's partially compiled bundle references GalleryItemComponent before defining it,
// which throws when the Angular test builder loads the package unlinked. The gallery is not
// under test here, so stand it in with empty classes.
vi.mock('ng-gallery', () => ({Gallery: class {}, GalleryModule: class {}, ImageItem: class {}, GALLERY_CONFIG: 'GALLERY_CONFIG'}));
vi.mock('ng-gallery/lightbox', () => ({Lightbox: class {}, LightboxModule: class {}}));

/**
 * The section wrapper lost its mat-card. These assertions pin the behaviour the
 * five consuming screens depend on — the #section{id} anchor that case-edit-nav
 * scrolls to, the approval radio group, and nested-section recursion — so the
 * restyle is provably behaviour-neutral.
 */
function makeElement(overrides: Partial<ElementDto> = {}): ElementDto {
  return {
    id: 42,
    label: 'Kvittering',
    approvalEnabled: false,
    reviewEnabled: false,
    extraFieldsEnabled: false,
    status: 'not_checked',
    dataItemList: [],
    elementList: [],
    extraComments: [],
    extraPictures: [],
    ...overrides,
  } as unknown as ElementDto;
}

describe('CaseEditElementComponent', () => {
  let fixture: ComponentFixture<CaseEditElementComponent>;
  let component: CaseEditElementComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // MatRadioModule is required, not optional: FormsModule makes NgModel match
      // [(ngModel)] on <mat-radio-group>, and without the real component there is
      // no ControlValueAccessor, so NgModel throws NG01203.
      // CaseEditElementComponent itself is deliberately not listed: TestBed would then walk its
      // real dependency graph, which is circular (element-container renders the switch again).
      imports: [TranslateModule.forRoot(), FormsModule, MatRadioModule],
    })
      // The child field components stay unknown elements here, as they were before
      // the component went standalone: only the section wrapper is under test.
      .overrideComponent(CaseEditElementComponent, {
        set: {
          imports: [NgIf, NgFor, FormsModule, MatRadioGroup, MatRadioButton, TranslatePipe],
          schemas: [NO_ERRORS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CaseEditElementComponent);
    component = fixture.componentInstance;
  });

  function render(element: ElementDto, showSectionTitle = true) {
    // setInput marks the view dirty, so a second render() in one test is picked up by the
    // zoneless fixture instead of tripping its no-changes check.
    fixture.componentRef.setInput('element', element);
    fixture.componentRef.setInput('showSectionTitle', showSectionTitle);
    fixture.detectChanges();
  }

  // U10
  it('renders the element label as the section heading', () => {
    render(makeElement({label: 'Sikkerhed'}));
    const title = fixture.debugElement.query(By.css('.eform-section__title'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent.trim()).toBe('Sikkerhed');
  });

  it('hides the section heading when the host asks it to', () => {
    render(makeElement({label: 'Kvittering'}), false);
    expect(fixture.debugElement.query(By.css('.eform-section__title'))).toBeNull();
  });

  it('shows the section heading by default so other consumers are unaffected', () => {
    component.element = makeElement();
    fixture.detectChanges();
    expect(component.showSectionTitle).toBe(true);
    expect(fixture.debugElement.query(By.css('.eform-section__title'))).toBeTruthy();
  });

  // U11 — case-edit-nav scrolls to this id; losing it silently breaks the nav.
  it('keeps the section anchor id', () => {
    render(makeElement({id: 7}));
    expect(fixture.debugElement.query(By.css('#section7'))).toBeTruthy();
  });

  // U12
  it('renders no approval radio group when approval is disabled', () => {
    render(makeElement({approvalEnabled: false}));
    expect(fixture.debugElement.query(By.css('mat-radio-group'))).toBeNull();
  });

  it('renders three approval options when approval is enabled without review', () => {
    render(makeElement({approvalEnabled: true, reviewEnabled: false}));
    expect(fixture.debugElement.query(By.css('mat-radio-group'))).toBeTruthy();
    expect(fixture.debugElement.queryAll(By.css('mat-radio-button')).length).toBe(3);
  });

  it('adds the review option when review is enabled', () => {
    render(makeElement({approvalEnabled: true, reviewEnabled: true}));
    expect(fixture.debugElement.queryAll(By.css('mat-radio-button')).length).toBe(4);
  });

  // U13
  it('recurses into nested sections', () => {
    render(makeElement({elementList: [makeElement({id: 43, label: 'Underafsnit'})] as any}));
    expect(fixture.debugElement.queryAll(By.css('app-case-edit-element')).length).toBe(1);
  });

  it('renders the extra-fields blocks only when enabled', () => {
    render(makeElement({extraFieldsEnabled: false}));
    expect(fixture.debugElement.queryAll(By.css('.eform-field')).length).toBe(0);

    render(makeElement({extraFieldsEnabled: true}));
    // Extra comment, extra picture, extra recording.
    expect(fixture.debugElement.queryAll(By.css('.eform-field')).length).toBe(3);
  });

  it('emits needUpdate upward', () => {
    const spy = vi.fn();
    component.needUpdate.subscribe(spy);
    component.emitNeedUpdate();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
