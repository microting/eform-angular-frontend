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
  EformVisualEditorModel,
  EformVisualEditorRecursionChecklistModel,
} from 'src/app/common/models';
import { LocaleService } from 'src/app/common/services';
import { fixTranslations } from 'src/app/common/helpers';
import * as R from 'ramda';

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
  recursionModel: EformVisualEditorRecursionChecklistModel = new EformVisualEditorRecursionChecklistModel();
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

  get isAllNamesEmpty() {
    return !this.recursionModel.checklist.translations.find(
      (x) => x.name !== ''
    );
  }

  show(model?: EformVisualEditorRecursionChecklistModel) {
    if (model) {
      this.recursionModel = R.clone(model);
      this.isChecklistSelected = false;
    }
    if (model && model.checklist) {
      this.isChecklistSelected = true;

      // if there are not enough translations
      this.recursionModel.checklist.translations = fixTranslations(
        this.recursionModel.checklist.translations
      );
    } else {
      if (!model) {
        this.isChecklistSelected = false;
        this.recursionModel = new EformVisualEditorRecursionChecklistModel();
      }
      this.initForm();
    }
    this.frame.show();
  }

  initForm() {
    this.recursionModel.checklist = new EformVisualEditorModel();
    for (const language of applicationLanguages) {
      this.recursionModel.checklist.translations = [
        ...this.recursionModel.checklist.translations,
        { id: null, languageId: language.id, description: '', name: '' },
      ];
    }
  }

  onCreateChecklist() {
    this.createChecklist.emit({
      ...this.recursionModel,
    });
    this.frame.hide();
  }

  onUpdateChecklist() {
    this.updateChecklist.emit({
      ...this.recursionModel,
    });
    this.frame.hide();
    this.isChecklistSelected = false;
  }
}
