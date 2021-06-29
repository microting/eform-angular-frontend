import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { applicationLanguages } from 'src/app/common/const';
import {
  CommonDictionaryModel,
  EformVisualEditorFieldModel,
} from 'src/app/common/models';
import { LocaleService } from 'src/app/common/services';

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
  selectedField: EformVisualEditorFieldModel;
  selectedFieldTranslations: CommonDictionaryModel[] = [];

  get languages() {
    return applicationLanguages;
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
    this.selectedField = model;
    if (model) {
      this.selectedFieldTranslations = model.translations;
    } else {
      this.initForm();
    }
    this.frame.show();
  }

  initForm() {
    for (const language of applicationLanguages) {
      this.selectedFieldTranslations = [
        ...this.selectedFieldTranslations,
        { id: language.id, description: '', name: '' },
      ];
    }
  }

  onCreateField() {
    this.createField.emit();
    this.frame.hide();
  }

  onUpdateField() {
    this.updateField.emit();
    this.frame.hide();
  }
}
