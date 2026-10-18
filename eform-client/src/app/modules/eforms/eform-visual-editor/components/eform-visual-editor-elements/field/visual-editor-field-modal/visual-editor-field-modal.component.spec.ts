import { describe, it, expect, beforeEach, vi } from 'vitest';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {provideMockStore} from '@ngrx/store/testing';
import {VisualEditorFieldModalComponent} from './visual-editor-field-modal.component';
import {FormattingTextEditorComponent} from 'src/app/common/modules/eform-imported/formatting-text-editor/formatting-text-editor.component';
import {AuthStateService} from 'src/app/common/store';
import {TranslationService} from 'src/app/common/services';
import {selectCurrentUserIsAdmin} from 'src/app/state/auth/auth.selector';
import {LanguagesModel} from 'src/app/common/models';
import {EformFieldTypesEnum} from 'src/app/common/const';

/**
 * Issue #8141: on a Galera cluster (auto_increment_increment=3) the SDK's
 * FieldTypes rows get ids 3, 6, 9, ... instead of 1..20. The visual editor
 * must keep speaking the positional EformFieldTypesEnum (the backend maps
 * names <-> DB ids), so picking a type in the modal must behave the same no
 * matter which DB ids the tenant happens to have.
 */

// FieldTypes as a fresh Galera install seeds them (Text=3 ... ShowPicture=60).
const shiftedDbFieldTypes = [
  'Text', 'Number', 'None', 'CheckBox', 'Picture', 'Audio', 'Movie',
  'SingleSelect', 'Comment', 'MultiSelect', 'Date', 'Signature', 'Timer',
  'EntitySearch', 'EntitySelect', 'ShowPdf', 'FieldGroup', 'SaveButton',
  'NumberStepper', 'ShowPicture',
].map((type, i) => ({id: (i + 1) * 3, type, description: type}));

const appLanguages: LanguagesModel = {
  languages: [{id: 3, name: 'Dansk', languageCode: 'da', isActive: true}],
};

describe('VisualEditorFieldModalComponent (shifted DB lookup ids, #8141)', () => {
  let fixture: ComponentFixture<VisualEditorFieldModalComponent>;
  let component: VisualEditorFieldModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualEditorFieldModalComponent, TranslateModule.forRoot()],
      providers: [
        provideMockStore({selectors: [{selector: selectCurrentUserIsAdmin, value: false}]}),
        {provide: AuthStateService, useValue: {}},
        {provide: TranslationService, useValue: {}},
        {provide: MatDialogRef, useValue: {close: vi.fn()}},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            selectedLanguages: [3],
            appLanguages,
            translationPossible: false,
            // What the container handed the modal before the fix.
            dbFieldTypes: shiftedDbFieldTypes,
          },
        },
      ],
    })
      // The rich-text editor (ProseMirror) needs a full MutationObserver, which the test DOM
      // lacks; it is not under test, so leave <formatting-text-editor> an unknown element.
      .overrideComponent(VisualEditorFieldModalComponent, {
        remove: {imports: [FormattingTextEditorComponent]},
        add: {schemas: [NO_ERRORS_SCHEMA]},
      })
      .compileComponents();

    fixture = TestBed.createComponent(VisualEditorFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Does what the Type dropdown does when the user picks an entry by name. */
  function pickType(name: string) {
    const option = component.fieldTypes.find((x) => x.name === name);
    expect(option).toBeDefined();
    component.updateFieldType(option.id);
    fixture.detectChanges();
  }

  it('stores the EformFieldTypesEnum value for SingleSelect, not the shifted DB id', () => {
    const option = component.fieldTypes.find((x) => x.name === 'SingleSelect');
    expect(option.id).toBe(EformFieldTypesEnum.SingleSelect);

    pickType('SingleSelect');

    expect(component.recursionModel.field.fieldType).toBe(EformFieldTypesEnum.SingleSelect);
    expect(component.recursionModel.field.fieldType).toBe(8);
    expect(component.recursionModel.field.fieldType).not.toBe(24);
  });

  it('shows the options editor when SingleSelect is picked', () => {
    pickType('SingleSelect');

    expect(
      fixture.debugElement.query(By.css('app-visual-editor-additional-field-options'))
    ).not.toBeNull();
  });

  it('offers the Mandatory checkbox when Text is picked', () => {
    pickType('Text (TextSingleLine)');

    expect(component.mandatoryIsNotNeed).toBe(false);
    expect(fixture.debugElement.query(By.css('#isChecked'))).not.toBeNull();
  });

  it('hides the Mandatory checkbox when None is picked', () => {
    pickType('None');

    expect(component.mandatoryIsNotNeed).toBe(true);
    expect(fixture.debugElement.query(By.css('#isChecked'))).toBeNull();
  });
});
