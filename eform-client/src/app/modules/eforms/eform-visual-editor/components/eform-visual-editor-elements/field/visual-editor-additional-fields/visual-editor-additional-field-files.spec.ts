import {NO_ERRORS_SCHEMA, SimpleChange, Type} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {VisualEditorAdditionalFieldPdfComponent} from './visual-editor-additional-field-pdf/visual-editor-additional-field-pdf.component';
import {VisualEditorAdditionalFieldShowPictureComponent} from './visual-editor-additional-field-show-picture/visual-editor-additional-field-show-picture.component';
import {EformVisualEditorFieldModel, LanguagesModel} from 'src/app/common/models';

/**
 * Issue #8141: Languages ids are AUTO_INCREMENT-seeded, so on a Galera tenant they are
 * Dansk=3, English=6, Deutsch=9. The per-language file pickers of ShowPdf / ShowPicture
 * must find a language's file by its id, not by treating the id as a 1-based array index.
 */
const appLanguages: LanguagesModel = {
  languages: [
    {id: 3, name: 'Dansk', languageCode: 'da', isActive: true},
    {id: 6, name: 'English', languageCode: 'en-US', isActive: true},
    {id: 9, name: 'Deutsch', languageCode: 'de-DE', isActive: true},
  ],
};

type FilePicker = VisualEditorAdditionalFieldPdfComponent | VisualEditorAdditionalFieldShowPictureComponent;

const pickers: [string, Type<FilePicker>, 'pdfFiles' | 'pngFiles'][] = [
  ['ShowPdf', VisualEditorAdditionalFieldPdfComponent, 'pdfFiles'],
  ['ShowPicture', VisualEditorAdditionalFieldShowPictureComponent, 'pngFiles'],
];

describe.each(pickers)('%s file picker (shifted Languages ids, #8141)', (_, componentType, filesKey) => {
  let fixture: ComponentFixture<FilePicker>;
  let component: FilePicker;

  function render(selectedLanguages: number[]) {
    fixture = TestBed.createComponent(componentType);
    component = fixture.componentInstance;
    const field = new EformVisualEditorFieldModel();
    field.pdfFiles = [];
    field.pngFiles = [];
    component.field = field;
    component.appLanguages = appLanguages;
    component.selectedLanguages = selectedLanguages;
    component.ngOnChanges({field: new SimpleChange(undefined, field, true)});
    fixture.detectChanges();
  }

  function selectFile(languageId: number, fileName: string) {
    const file = new File(['x'], fileName);
    component.onFileSelected({target: {files: [file]}} as unknown as Event, languageId);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [componentType],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('renders a picker for each selected language', () => {
    render([3, 9]);

    const headers = fixture.nativeElement.querySelectorAll('mat-card-header');
    expect(Array.from(headers).map((x: HTMLElement) => x.textContent.trim())).toEqual(['Dansk', 'Deutsch']);
  });

  it('shows the file chosen for a language under that language only', () => {
    render([3, 6, 9]);

    selectFile(6, 'english.bin');

    expect(component.getFileNameByLanguage(6)).toBe('english.bin');
    expect(component.getFileNameByLanguage(3)).toBeFalsy();
    expect(component.getFileNameByLanguage(9)).toBeFalsy();
    expect(component.field[filesKey].find((x) => x.languageId === 6).name).toBe('english.bin');
  });
});
