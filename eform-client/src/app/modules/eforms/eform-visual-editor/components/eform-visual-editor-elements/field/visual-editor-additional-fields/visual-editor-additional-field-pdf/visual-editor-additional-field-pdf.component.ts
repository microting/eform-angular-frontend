import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {EformVisualEditorFieldModel, LanguagesModel} from 'src/app/common/models';
import * as R from 'ramda';

@Component({
    selector: 'app-visual-editor-additional-field-pdf',
    templateUrl: './visual-editor-additional-field-pdf.component.html',
    styleUrls: ['./visual-editor-additional-field-pdf.component.scss'],
    standalone: false
})
export class VisualEditorAdditionalFieldPdfComponent
  implements OnChanges, OnDestroy {
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field) {
      const sortByFn = R.sortBy(R.prop('id'));
      this.appLanguages.languages.forEach((x) => {
        const index = this.field.pdfFiles.findIndex(
          (y) => y.languageId === x.id || y.id === x.id
        );
        if (index === -1) {
          this.field.pdfFiles.push({
            id: x.id,
            name: '',
            languageId: x.id,
            file: null,
          });
        }
        if (index !== -1) {
          this.field.pdfFiles[index].languageId = x.id;
        }
        this.field.pdfFiles = sortByFn(this.field.pdfFiles);
      });
    }
  }

  ngOnDestroy(): void {}

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  getLanguage(languageId: number): any {
    return this.languages.find((x) => x.id === languageId);
  }

  onFileSelected(event: Event, selectedLanguage: number) {
    // @ts-ignore
    const files: File[] = event.target.files;
    const filesIndexByLanguage = this.field.pdfFiles.findIndex(
      (x) => x.languageId === selectedLanguage || x.id === selectedLanguage
    );
    if (filesIndexByLanguage !== -1) {
      this.field.pdfFiles[filesIndexByLanguage].file = R.last(files);
      this.field.pdfFiles[filesIndexByLanguage].name = R.last(files).name;
    }
  }

  getFileNameByLanguage(languageId: number): string {
    // Look up by languageId: Languages ids are not contiguous on every install (#8141).
    const entry = this.field.pdfFiles.find((x) => x.languageId === languageId);
    if (!entry) {
      return undefined;
    }
    return entry.id ? entry.name : entry.file?.name;
  }
}
