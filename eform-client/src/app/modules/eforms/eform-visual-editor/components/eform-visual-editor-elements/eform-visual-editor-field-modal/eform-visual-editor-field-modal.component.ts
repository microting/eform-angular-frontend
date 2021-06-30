import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { applicationLanguages } from 'src/app/common/const';
import { EformVisualEditorFieldModel } from 'src/app/common/models';
import { LocaleService } from 'src/app/common/services';
import { eformVisualEditorElementTypes } from '../../../const/eform-visual-editor-element-types';

@Component({
  selector: 'app-eform-visual-editor-field-modal',
  templateUrl: './eform-visual-editor-field-modal.component.html',
  styleUrls: ['./eform-visual-editor-field-modal.component.scss'],
})
export class EformVisualEditorFieldModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output()
  createField: EventEmitter<EformVisualEditorFieldModel> = new EventEmitter<EformVisualEditorFieldModel>();
  @Output()
  updateField: EventEmitter<EformVisualEditorFieldModel> = new EventEmitter<EformVisualEditorFieldModel>();
  selectedLanguage: number;
  editorField: EformVisualEditorFieldModel = new EformVisualEditorFieldModel();
  isFieldSelected = false;

  get languages() {
    return applicationLanguages;
  }

  get fieldTypes() {
    return eformVisualEditorElementTypes;
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

  show(model?: EformVisualEditorFieldModel) {
    if (model) {
      this.isFieldSelected = true;
      this.editorField = model;
    } else {
      this.initForm();
    }
    this.frame.show();
  }

  initForm() {
    this.editorField = new EformVisualEditorFieldModel();
    for (const language of applicationLanguages) {
      this.editorField.translations = [
        ...this.editorField.translations,
        { id: language.id, description: '', name: '' },
      ];
    }
  }

  onCreateField() {
    this.createField.emit({
      ...this.editorField,
    });
    this.frame.hide();
  }

  onUpdateField() {
    this.updateField.emit({ ...this.editorField });
    this.frame.hide();
  }
}
