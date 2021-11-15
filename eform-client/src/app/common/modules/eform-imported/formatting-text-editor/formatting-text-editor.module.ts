import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormattingTextEditorComponent } from './formatting-text-editor.component';
import { NgxEditorModule } from 'ngx-editor';
import { EformSharedModule } from '../../eform-shared/eform-shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, NgxEditorModule, EformSharedModule, FormsModule],
  declarations: [FormattingTextEditorComponent],
  exports: [FormattingTextEditorComponent],
})
export class FormattingTextEditorModule {}
