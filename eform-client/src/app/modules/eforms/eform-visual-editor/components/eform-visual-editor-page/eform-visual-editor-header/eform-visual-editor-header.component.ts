import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { applicationLanguages } from 'src/app/common/const';
import {
  CommonDictionaryModel,
  EformVisualEditorModel,
} from 'src/app/common/models';
import { LocaleService } from 'src/app/common/services';

@Component({
  selector: 'app-eform-visual-editor-header',
  templateUrl: './eform-visual-editor-header.component.html',
  styleUrls: ['./eform-visual-editor-header.component.scss'],
})
export class EformVisualEditorHeaderComponent implements OnInit {
  @Input()
  visualEditorModel: EformVisualEditorModel = new EformVisualEditorModel();
  selectedLanguage: number;
  @Input() availableTags: CommonDictionaryModel[];

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
    return !this.visualEditorModel.translations.find((x) => x.name !== '');
  }
}
