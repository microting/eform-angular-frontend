import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  CommonTranslationsModel,
  EformVisualEditorFieldModel,
  TableHeaderElementModel,
} from 'src/app/common/models';
import * as R from 'ramda';
import { applicationLanguages } from 'src/app/common/const';

@Component({
  selector: 'app-visual-editor-additional-field-options',
  templateUrl: './visual-editor-additional-field-options.component.html',
  styleUrls: ['./visual-editor-additional-field-options.component.scss'],
})
export class VisualEditorAdditionalFieldOptionsComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  @Input() selectedLanguages: number[];
  @ViewChild('buttonWithPopoverDelete')
  buttonWithPopoverDelete;
  @ViewChild('buttonWithPopoverEdit')
  buttonWithPopoverEdit;
  options: string;
  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Name', elementId: '', sortable: false },
    { name: 'Actions', elementId: '', sortable: false },
  ];
  fieldOptionForEdit: {
    selectedLanguage: number;
    name: string;
    indexOption: number;
  };
  indexOptionForDelete: number;
  constructor() {}

  ngOnInit() {}

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  getLanguage(languageId: number): string {
    return applicationLanguages.find((x) => x.id === languageId).text;
  }

  ngOnDestroy(): void {}

  parseOptions() {
    if (this.options !== '') {
      const parsedOptions = R.split('\n', this.options);
      for (const parsedOption of parsedOptions) {
        const parsedTranslates = R.split('|', parsedOption);
        let translatesOptions: CommonTranslationsModel[] = [];
        for (let i = 0; i < applicationLanguages.length; i++) {
          translatesOptions = [
            ...translatesOptions,
            {
              id: null,
              languageId: applicationLanguages[i].id,
              description: '',
              name: parsedTranslates[i] || '',
            },
          ];
        }
        this.field.options = [
          ...this.field.options,
          {
            translates: translatesOptions,
            key: this.field.options.length,
            id: null,
            selected: false,
            displayOrder: this.field.options.length,
          },
        ];
      }
      this.options = '';
    }
  }

  getTranslationOptionsByLanguageId(
    languageId: number
  ): CommonTranslationsModel[] {
    return R.filter(
      (x) => x.languageId === languageId,
      R.flatten(R.map((x) => x.translates, this.field.options))
    );
  }

  openEditOptionTranslate(indexOption: number, selectedLanguage: number) {
    this.fieldOptionForEdit = {
      name: this.field.options[indexOption].translates.find(
        (x) => x.languageId === selectedLanguage
      ).name,
      indexOption: indexOption,
      selectedLanguage: selectedLanguage,
    };
    this.buttonWithPopoverEdit.show();
  }

  openDeleteOptionTranslate(indexOption: number) {
    this.indexOptionForDelete = indexOption;
    this.buttonWithPopoverDelete.show();
  }

  save() {
    this.field.options[this.fieldOptionForEdit.indexOption].translates.find(
      (x) => x.languageId === this.fieldOptionForEdit.selectedLanguage
    ).name = this.fieldOptionForEdit.name;
    this.buttonWithPopoverEdit.hide();
  }

  delete() {
    this.field.options = this.field.options.filter(
      (x, index) => index !== this.indexOptionForDelete
    );
    this.buttonWithPopoverDelete.hide();
  }

  getLanguageTooltip() {
    return R.join(
      ', ',
      R.map((x) => x.text, applicationLanguages)
    );
  }

  getExampleTooltip() {
    return `${R.join(
      '|',
      R.map((x) => 'optionTranslate' + x.id, applicationLanguages)
    )} it's one option with ${
      applicationLanguages.length
    } translations: ${this.getLanguageTooltip()}`;
  }
}
