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
  EformVisualEditorElementTranslateModel,
  EformVisualEditorModel,
} from 'src/app/common/models';
import { LocaleService } from 'src/app/common/services';

@Component({
  selector: 'app-visual-editor-checklist-modal',
  templateUrl: './visual-editor-checklist-modal.component.html',
  styleUrls: ['./visual-editor-checklist-modal.component.scss'],
})
export class VisualEditorChecklistModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output()
  createChecklist: EventEmitter<EformVisualEditorModel> = new EventEmitter<EformVisualEditorModel>();
  @Output()
  updateChecklist: EventEmitter<EformVisualEditorModel> = new EventEmitter<EformVisualEditorModel>();
  selectedLanguage: number;
  selectedChecklist: EformVisualEditorModel;
  selectedChecklistTranslations: EformVisualEditorElementTranslateModel[] = [];

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

  show(model?: EformVisualEditorModel) {
    this.selectedChecklist = { ...model };
    if (model) {
      this.selectedChecklistTranslations = { ...model.translations };

      // if there are not enough translations
      if (
        this.selectedChecklist.translations.length < applicationLanguages.length
      ) {
        for (const language of applicationLanguages) {
          if (
            !this.selectedChecklist.translations.find(
              (x) => x.languageId === language.id
            )
          ) {
            this.selectedChecklist.translations = [
              ...this.selectedChecklist.translations,
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
    for (const language of applicationLanguages) {
      this.selectedChecklistTranslations = [
        ...this.selectedChecklistTranslations,
        { id: null, languageId: language.id, description: '', name: '' },
      ];
    }
  }

  onAddChecklist() {
    this.createChecklist.emit();
    this.frame.hide();
  }

  onUpdateChecklist() {
    this.updateChecklist.emit();
    this.frame.hide();
  }
}
