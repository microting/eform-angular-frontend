import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-uuid';
import { applicationLanguages } from 'src/app/common/const';
import {
  EformVisualEditorFieldModel,
  EformVisualEditorFieldsDnDRecursionModel,
  EformVisualEditorRecursionFieldModel,
} from 'src/app/common/models';
import { LocaleService } from 'src/app/common/services';
import {
  eformVisualEditorElementColors,
  eformVisualEditorElementTypes,
} from '../../../../const/eform-visual-editor-element-types';

@Component({
  selector: 'app-visual-editor-field-modal',
  templateUrl: './visual-editor-field-modal.component.html',
  styleUrls: ['./visual-editor-field-modal.component.scss'],
})
export class VisualEditorFieldModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
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
    this.selectedLanguage = applicationLanguages.find(
      (x) => x.locale === this.localeService.getCurrentUserLocale()
    ).id;
  }

  show(model?: EformVisualEditorRecursionFieldModel) {
    if (model) {
      this.recursionModel = { ...model };
    }
    if (model && model.field) {
      this.isFieldSelected = true;
      // if there are not enough translations
      if (
        this.recursionModel.field.translations.length <
        applicationLanguages.length
      ) {
        for (const language of applicationLanguages) {
          if (
            !this.recursionModel.field.translations.find(
              (x) => x.languageId === language.id
            )
          ) {
            this.recursionModel.field.translations = [
              ...this.recursionModel.field.translations,
              { id: null, languageId: language.id, description: '', name: '' },
            ];
          }
        }
      }
    } else {
      this.initForm();
    }
    this.frame.show();
  }

  initForm() {
    this.recursionModel.field = new EformVisualEditorFieldModel();
    for (const language of applicationLanguages) {
      this.recursionModel.field.translations = [
        ...this.recursionModel.field.translations,
        { id: null, languageId: language.id, description: '', name: '' },
      ];
    }
  }

  onCreateField() {
    this.createField.emit({
      ...this.recursionModel,
    });
    this.frame.hide();
  }

  onUpdateField() {
    this.updateField.emit({
      ...this.recursionModel,
    });
    this.frame.hide();
    this.isFieldSelected = false;
  }

  mandatoryCheckboxClick(e: any) {
    if (e.target && e.target.checked) {
      this.recursionModel.field = {
        ...this.recursionModel.field,
        mandatory: true,
      };
    } else if (e.target && !e.target.checked) {
      this.recursionModel.field = {
        ...this.recursionModel.field,
        mandatory: false,
      };
    } else {
      return;
    }
  }
}
