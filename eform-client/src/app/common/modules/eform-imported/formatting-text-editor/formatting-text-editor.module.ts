import {NgModule} from '@angular/core';
import {FormattingTextEditorComponent} from './formatting-text-editor.component';
import {NgxEditorModule} from 'ngx-editor';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [NgxEditorModule, ReactiveFormsModule],
  declarations: [FormattingTextEditorComponent],
  exports: [FormattingTextEditorComponent],
})
export class FormattingTextEditorModule {
}
