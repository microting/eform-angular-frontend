import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {EformVisualEditorFieldModel, LanguagesModel} from 'src/app/common/models';
import { MatDatepickerInputEvent, MatDatepickerToggle, MatDatepickerInput, MatDatepicker } from "@angular/material/datepicker";
import {format, set} from "date-fns";
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-visual-editor-additional-field-date',
    templateUrl: './visual-editor-additional-field-date.component.html',
    styleUrls: ['./visual-editor-additional-field-date.component.scss'],
    imports: [MatCard, MatCardContent, MatFormField, MatLabel, MatDatepickerToggle, MatSuffix, MatInput, MatDatepickerInput, ReactiveFormsModule, FormsModule, MatDatepicker, MatError, TranslatePipe]
})
export class VisualEditorAdditionalFieldDateComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  @Input() selectedLanguages: number[];
  @Input() appLanguages: LanguagesModel = new LanguagesModel();

  get languages() {
    //return applicationLanguages;
    // wait for the appLanguages to be loaded
    if (!this.appLanguages.languages) {
      return [];
    }
    return this.appLanguages.languages.filter((x) => x.isActive);
  }

  constructor() {}

  ngOnInit() {
    // @ts-ignore
    if (this.field.minValue === '0001-01-01') {
      // @ts-ignore
      this.field.minValue = '2000-01-01';
    }
    // @ts-ignore
    if (this.field.maxValue === '9999-12-31') {
      // @ts-ignore
      this.field.maxValue = '2100-01-01';
    }
  }

  ngOnDestroy(): void {}

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  getLanguage(languageId: number): any {
    return this.languages.find((x) => x.id === languageId);
  }

  onDateSelectedMin(e: MatDatepickerInputEvent<any, any>) {
    let date = e.value;
    date = format(set(date, {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      date: date.getDate(),
      year: date.getFullYear(),
      month: date.getMonth(),
    }), 'yyyy-MM-dd');
    this.field.minValue = date;
  }

  onDateSelectedMax(e: MatDatepickerInputEvent<any, any>) {
    let date = e.value;
    date = format(set(date, {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      date: date.getDate(),
      year: date.getFullYear(),
      month: date.getMonth(),
    }), 'yyyy-MM-dd');
    this.field.maxValue = date;
  }
}
