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
  EformVisualEditorElementTranslateModel, EformVisualEditorFieldModel,
  EformVisualEditorModel,
  EformVisualEditorRecursionChecklistModel,
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
  createChecklist: EventEmitter<EformVisualEditorRecursionChecklistModel> = new EventEmitter<EformVisualEditorRecursionChecklistModel>();
  @Output()
  updateChecklist: EventEmitter<EformVisualEditorRecursionChecklistModel> = new EventEmitter<EformVisualEditorRecursionChecklistModel>();
  selectedLanguage: number;
  selectedChecklist: EformVisualEditorRecursionChecklistModel = new EformVisualEditorRecursionChecklistModel();
  isChecklistSelected = false;

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

  show(model?: EformVisualEditorRecursionChecklistModel) {
    if (model) {
      this.selectedChecklist = { ...model };
      this.isChecklistSelected = true;

      // if there are not enough translations
      if (
        this.selectedChecklist.checklist.translations.length <
        applicationLanguages.length
      ) {
        for (const language of applicationLanguages) {
          if (
            !this.selectedChecklist.checklist.translations.find(
              (x) => x.languageId === language.id
            )
          ) {
            this.selectedChecklist.checklist.translations = [
              ...this.selectedChecklist.checklist.translations,
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
    this.selectedChecklist.checklist = new EformVisualEditorModel();
    for (const language of applicationLanguages) {
      this.selectedChecklist.checklist.translations = [
        ...this.selectedChecklist.checklist.translations,
        { id: null, languageId: language.id, description: '', name: '' },
      ];
    }
  }

  onCreateChecklist() {
    this.createChecklist.emit({
      ...this.selectedChecklist,
    });
    this.frame.hide();
  }

  onUpdateChecklist() {
    this.updateChecklist.emit({
      ...this.selectedChecklist,
    });
    this.frame.hide();
    this.isChecklistSelected = false;
  }
}
