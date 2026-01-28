import {Component, Input, OnInit, OnDestroy, Output, EventEmitter, forwardRef} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {CommonTranslationsModel} from 'src/app/common/models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormattingTextEditorComponent } from '../../../eform-imported/formatting-text-editor/formatting-text-editor.component';
import { TranslatePipe } from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
    selector: 'app-eform-translation',
    templateUrl: './eform-translation.component.html',
    styleUrls: ['./eform-translation.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EformTranslationComponent),
            multi: true
        }
    ],
    imports: [MatCard, NgIf, MatCardHeader, MatCardContent, MatFormField, MatLabel, MatInput, ReactiveFormsModule, FormsModule, FormattingTextEditorComponent, TranslatePipe]
})
export class EformTranslationComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() model: CommonTranslationsModel = {id: undefined, description: '', name: '', languageId: 1};
  @Input() title: string = '';
  @Input() idName: string = '';
  @Output() modelChange: EventEmitter<CommonTranslationsModel> = new EventEmitter<CommonTranslationsModel>();

  // ControlValueAccessor interface methods
  onChange: any = () => {};
  onTouch: any = () => {};

  constructor(
  ) {
  }

  ngOnDestroy() {
  }

  ngOnInit() {
  }

  // ControlValueAccessor interface methods
  writeValue(obj: any): void {
    this.model = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // Call the methods when the value changes
  onNameChange(value: string) {
    this.model.name = value;
    this.onChange(this.model);
    this.onTouch();
    this.modelChange.emit(this.model);
  }

  onDescriptionChange(value: string) {
    this.model.description = value;
    this.onChange(this.model);
    this.onTouch();
    this.modelChange.emit(this.model);
  }
}
