import {
  Component,
  Inject, Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  EformFieldTypesEnum,
} from 'src/app/common/const';
import {
  EformVisualEditorFieldModel,
  EformVisualEditorFieldTypeModel,
  EformVisualEditorRecursionFieldModel,
  EformVisualEditorTranslationWithDefaultValue, LanguagesModel,
} from 'src/app/common/models';
import {getTranslatedTypes} from '../../../../const/eform-visual-editor-element-types';
import { fixTranslations } from 'src/app/common/helpers';
import * as R from 'ramda';
import {AuthStateService} from 'src/app/common/store';
import {TranslateService} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-visual-editor-field-modal',
  templateUrl: './visual-editor-field-modal.component.html',
  styleUrls: ['./visual-editor-field-modal.component.scss'],
})
export class VisualEditorFieldModalComponent implements OnInit {
  @ViewChild('popTemplate', { static: true }) popTemplate;
  selectedLanguages: number[];
  recursionModel: EformVisualEditorRecursionFieldModel = new EformVisualEditorRecursionFieldModel();
  isFieldSelected = false;
  fieldTypes: EformVisualEditorFieldTypeModel[];
  appLanguages: LanguagesModel = new LanguagesModel();

  get languages() {
    //return applicationLanguages;
    // wait for the appLanguages to be loaded
    if (!this.appLanguages.languages) {
      return [];
    }
    return this.appLanguages.languages.filter((x) => x.isActive);
  }

  setFieldTypes() {
    const typesForAdminOnly = [
      EformFieldTypesEnum.Text,
      EformFieldTypesEnum.Audio,
      EformFieldTypesEnum.Movie,
      EformFieldTypesEnum.MultiSelect
    ];
    if (this.recursionModel.fieldIsNested) {
      this.fieldTypes = [
        ...getTranslatedTypes(this.translateService).filter(
          (x) => x.id !== EformFieldTypesEnum.FieldGroup
        ),
      ];
    } else {
      this.fieldTypes = [...getTranslatedTypes(this.translateService)];
    }
    if (!this.authStateService.isAdmin) {
      this.fieldTypes = this.fieldTypes.filter(x => !typesForAdminOnly.includes(x.id));
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

  constructor(
    private authStateService: AuthStateService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<VisualEditorFieldModalComponent>,
    @Inject(MAT_DIALOG_DATA) model: {selectedLanguages: number[], model?: EformVisualEditorRecursionFieldModel, appLanguages: LanguagesModel }
  ) {
    this.selectedLanguages = model.selectedLanguages;
    this.appLanguages = model.appLanguages;
    // this.setSelectedLanguage();
    if (model.model) {
      this.recursionModel = R.clone(model.model);
    }
    if (model.model && model.model.field) {
      this.isFieldSelected = true;
      // if there are not enough translations
      this.recursionModel.field.translations = fixTranslations(
        this.recursionModel.field.translations, this.appLanguages
      ) as EformVisualEditorTranslationWithDefaultValue[];
      //   .map((x, i) => {
      //   if (this.recursionModel.field.translations.length > i) {
      //     // @ts-ignore
      //     x.defaultValue =
      //       this.recursionModel.field.translations[i].defaultValue ?? '';
      //     return x as EformVisualEditorTranslationWithDefaultValue;
      //   }
      // });
    } else {
      if (!model.model) {
        this.recursionModel = new EformVisualEditorRecursionFieldModel();
      }
      this.initForm();
    }
    this.setFieldTypes();
  }

  ngOnInit() {
    // this.setSelectedLanguage();
  }

/*  show(model?: EformVisualEditorRecursionFieldModel) {
    // this.setSelectedLanguage();
    if (model) {
      this.recursionModel = R.clone(model);
    }
    if (model && model.field) {
      this.isFieldSelected = true;
      // if there are not enough translations
      this.recursionModel.field.translations = fixTranslations(
        this.recursionModel.field.translations
      ).map((x, i) => {
        if (this.recursionModel.field.translations.length > i) {
          // @ts-ignore
          x.defaultValue =
            this.recursionModel.field.translations[i].defaultValue ?? '';
          return x as EformVisualEditorTranslationWithDefaultValue;
        }
      });
    } else {
      if (!model) {
        this.recursionModel = new EformVisualEditorRecursionFieldModel();
      }
      this.initForm();
    }
    this.setFieldTypes();
    // this.frame.show();
  }*/

  initForm() {
    this.recursionModel.field = new EformVisualEditorFieldModel();
    this.recursionModel.field.translations = fixTranslations(
      this.recursionModel.field.translations, this.appLanguages
    ).map((x) => {
      // @ts-ignore
      x.defaultValue = '';
      return x as EformVisualEditorTranslationWithDefaultValue;
    }); // create translations
  }

  onCreateField() {
    // this.createField.emit({
    //   ...this.recursionModel,
    // });
    this.hide(true, this.recursionModel, true);
    this.isFieldSelected = false;
  }

  onUpdateField() {
    // this.updateField.emit({
    //   ...this.recursionModel,
    // });
    this.hide(true, this.recursionModel, false);
    this.isFieldSelected = false;
  }

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  getLanguage(languageId: number): any {
    return this.languages.find((x) => x.id === languageId);
  }

  updateFieldType(type: number) {
    if (
      type === EformFieldTypesEnum.EntitySearch ||
      type === EformFieldTypesEnum.EntitySelect
    ) {
      this.recursionModel.field.entityGroupId = null;
    }
    this.recursionModel.field.fieldType = type;
  }

  hide(result = false, model?: EformVisualEditorRecursionFieldModel, create?: boolean) {
    this.dialogRef.close({result: result, create: create, model: result ? model : null});
  }
}
