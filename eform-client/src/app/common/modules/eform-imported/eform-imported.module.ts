import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PellModule } from './pell/pell.module';
import { FormattingTextEditorModule } from './formatting-text-editor/formatting-text-editor.module';

@NgModule({
  imports: [CommonModule, PellModule, FormattingTextEditorModule],
  declarations: [],
  exports: [PellModule, FormattingTextEditorModule],
})
export class EformImportedModule {}
