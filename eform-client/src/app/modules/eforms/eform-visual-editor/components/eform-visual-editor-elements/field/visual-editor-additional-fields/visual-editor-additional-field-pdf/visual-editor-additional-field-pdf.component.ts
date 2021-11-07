import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EformVisualEditorFieldModel } from 'src/app/common/models';
import { applicationLanguages } from 'src/app/common/const';
import * as R from 'ramda';

@Component({
  selector: 'app-visual-editor-additional-field-pdf',
  templateUrl: './visual-editor-additional-field-pdf.component.html',
  styleUrls: ['./visual-editor-additional-field-pdf.component.scss'],
})
export class VisualEditorAdditionalFieldPdfComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  @Input() selectedLanguages: number[];

  constructor() {}

  ngOnInit() {
    if (this.field) {
      applicationLanguages.forEach((x) =>
        // @ts-ignore
        this.field.pdfFiles.push({ languageId: x.id, file: null })
      );
    }
  }

  ngOnDestroy(): void {}

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  getLanguage(languageId: number): string {
    return applicationLanguages.find((x) => x.id === languageId).text;
  }

  onFileSelected(event: Event, selectedLanguage: number) {
    // @ts-ignore
    const files: File[] = event.target.files;
    const filesIndexByLanguage = this.field.pdfFiles.findIndex(
      (x) => x.languageId === selectedLanguage
    );
    if (filesIndexByLanguage !== -1) {
      this.field.pdfFiles[filesIndexByLanguage].file = R.last(files);
    }
  }

  getFileNameByLanguage(languageId: number): string {
    if (this.field.pdfFiles[0].id) {
      const index = this.field.pdfFiles.findIndex((x) => x.id === languageId);
      if (index !== -1) {
        return this.field.pdfFiles[index].name;
      }
    } else {
      const index = this.field.pdfFiles.findIndex(
        (x) => x.languageId === languageId
      );
      if (index !== -1) {
        const file = this.field.pdfFiles[index].file;
        if (file) {
          return file.name;
        }
      }
    }
  }
}
