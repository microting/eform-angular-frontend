import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  applicationLanguages,
  EformFieldTypesEnum,
} from 'src/app/common/const';
import {
  EformVisualEditorFieldModel,
  EformVisualEditorFieldTypeModel,
  EformVisualEditorRecursionFieldModel,
} from 'src/app/common/models';
import { eformVisualEditorElementTypes } from '../../../../const/eform-visual-editor-element-types';
import { fixTranslations } from 'src/app/common/helpers';
import * as R from 'ramda';

@Component({
  selector: 'app-visual-editor-field-modal',
  templateUrl: './visual-editor-field-modal.component.html',
  styleUrls: ['./visual-editor-field-modal.component.scss'],
})
export class VisualEditorFieldModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @ViewChild('popTemplate', { static: true }) popTemplate;
  @Input() selectedLanguages: number[];
  @Output()
  createField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter<EformVisualEditorRecursionFieldModel>();
  @Output()
  updateField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  recursionModel: EformVisualEditorRecursionFieldModel = new EformVisualEditorRecursionFieldModel();
  isFieldSelected = false;
  fieldTypes: EformVisualEditorFieldTypeModel[];

  get languages() {
    return applicationLanguages;
  }

  setFieldTypes() {
    if (this.recursionModel.fieldIsNested) {
      this.fieldTypes = [
        ...eformVisualEditorElementTypes.filter(
          (x) => x.id !== EformFieldTypesEnum.FieldGroup
        ),
      ];
    } else {
      this.fieldTypes = [...eformVisualEditorElementTypes];
    }
  }

  get eformFieldTypesEnum(): typeof EformFieldTypesEnum {
    return EformFieldTypesEnum;
  }

  get mandatoryIsNotNeed(): boolean {
    return (
      this.recursionModel.field.fieldType === EformFieldTypesEnum.None ||
      this.recursionModel.field.fieldType === EformFieldTypesEnum.FieldGroup ||
      this.recursionModel.field.fieldType === EformFieldTypesEnum.Audio ||
      this.recursionModel.field.fieldType === EformFieldTypesEnum.ShowPdf ||
      this.recursionModel.field.fieldType === EformFieldTypesEnum.SaveButton
    );
  }

  // get fieldColors(): CommonDictionaryModel[] {
  //   return eformVisualEditorElementColors;
  // }

  // get isAllNamesEmpty() {
  //   return !this.recursionModel.field.translations.find((x) => x.name !== '');
  // }

  constructor() {}

  ngOnInit() {
    // this.setSelectedLanguage();
  }

  show(model?: EformVisualEditorRecursionFieldModel) {
    // this.setSelectedLanguage();
    if (model) {
      this.recursionModel = R.clone(model);
    }
    if (model && model.field) {
      this.isFieldSelected = true;
      // if there are not enough translations
      this.recursionModel.field.translations = fixTranslations(
        this.recursionModel.field.translations
      );
    } else {
      if (!model) {
        this.recursionModel = new EformVisualEditorRecursionFieldModel();
      }
      this.initForm();
    }
    this.setFieldTypes();
    this.frame.show();
  }

  initForm() {
    this.recursionModel.field = new EformVisualEditorFieldModel();
    this.recursionModel.field.translations = fixTranslations(
      this.recursionModel.field.translations
    ); // create translations
  }

  onCreateField() {
    this.createField.emit({
      ...this.recursionModel,
    });
    this.frame.hide();
    this.isFieldSelected = false;
  }

  onUpdateField() {
    this.updateField.emit({
      ...this.recursionModel,
    });
    this.frame.hide();
    this.isFieldSelected = false;
  }

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  getLanguage(languageId: number): string {
    return this.languages.find((x) => x.id === languageId).text;
  }
}
