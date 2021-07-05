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
import { EformVisualEditorFieldModel } from 'src/app/common/models';
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
  createField: EventEmitter<EformVisualEditorFieldModel> = new EventEmitter<EformVisualEditorFieldModel>();
  @Output()
  updateField: EventEmitter<{
    field: EformVisualEditorFieldModel;
    fieldIndex: number;
  }> = new EventEmitter();
  selectedLanguage: number;
  fieldModel: EformVisualEditorFieldModel = new EformVisualEditorFieldModel();
  fieldIndex: number;
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

  constructor(
    private translateService: TranslateService,
    private localeService: LocaleService
  ) {}

  ngOnInit() {
    this.selectedLanguage = applicationLanguages.find(
      (x) => x.locale === this.localeService.getCurrentUserLocale()
    ).id;
  }

  show(model?: EformVisualEditorFieldModel, fieldIndex?: number) {
    if (model) {
      this.isFieldSelected = true;
      this.fieldIndex = fieldIndex;
      this.fieldModel = model;
    } else {
      this.initForm();
    }
    this.frame.show();
  }

  initForm() {
    this.fieldModel = new EformVisualEditorFieldModel();
    for (const language of applicationLanguages) {
      this.fieldModel.translations = [
        ...this.fieldModel.translations,
        { id: language.id, description: '', name: '' },
      ];
    }
  }

  onCreateField() {
    this.createField.emit({
      ...this.fieldModel,
      tempId: UUID.UUID(),
    });
    this.frame.hide();
  }

  onUpdateField() {
    debugger;
    this.updateField.emit({
      field: this.fieldModel,
      fieldIndex: this.fieldIndex,
    });
    this.frame.hide();
  }

  mandatoryCheckboxClick(e: any) {
    if (e.target && e.target.checked) {
      this.fieldModel = { ...this.fieldModel, mandatory: true };
    } else if (e.target && !e.target.checked) {
      this.fieldModel = { ...this.fieldModel, mandatory: false };
    } else {
      return;
    }
  }
}
