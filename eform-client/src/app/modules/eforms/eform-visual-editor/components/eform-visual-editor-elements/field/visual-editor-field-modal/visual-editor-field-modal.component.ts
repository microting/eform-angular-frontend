import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  applicationLanguages,
  EformFieldTypesEnum,
} from 'src/app/common/const';
import {
  EformVisualEditorFieldModel,
  EformVisualEditorRecursionFieldModel,
} from 'src/app/common/models';
import { LocaleService } from 'src/app/common/services';
import {
  eformVisualEditorElementColors,
  eformVisualEditorElementTypes,
} from '../../../../const/eform-visual-editor-element-types';
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
  @Output()
  createField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter<EformVisualEditorRecursionFieldModel>();
  @Output()
  updateField: EventEmitter<EformVisualEditorRecursionFieldModel> = new EventEmitter();
  selectedLanguage: number;
  recursionModel: EformVisualEditorRecursionFieldModel = new EformVisualEditorRecursionFieldModel();
  isFieldSelected = false;

  get languages() {
    return applicationLanguages;
  }

  get fieldTypes() {
    return eformVisualEditorElementTypes;
  }

  get eformFieldTypesEnum() {
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

  get fieldColors() {
    return eformVisualEditorElementColors;
  }

  get isAllNamesEmpty() {
    return !this.recursionModel.field.translations.find((x) => x.name !== '');
  }

  constructor(
    private translateService: TranslateService,
    private localeService: LocaleService
  ) {}

  ngOnInit() {
    this.setSelectedLanguage();
  }

  show(model?: EformVisualEditorRecursionFieldModel) {
    this.setSelectedLanguage();
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

  private setSelectedLanguage() {
    this.selectedLanguage = applicationLanguages.find(
      (x) => x.locale === this.localeService.getCurrentUserLocale()
    ).id;
  }
}
