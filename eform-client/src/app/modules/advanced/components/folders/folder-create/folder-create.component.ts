import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FoldersService } from 'src/app/common/services/advanced/folders.service';
import { FolderCreateModel, FolderDto } from 'src/app/common/models';
import { applicationLanguages } from 'src/app/common/const';
import { LocaleService } from 'src/app/common/services';

@Component({
  selector: 'app-folder-create',
  templateUrl: './folder-create.component.html',
})
export class FolderCreateComponent implements OnInit {
  @Output() folderCreated: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  selectedParentFolder: FolderDto;
  newFolderModel: FolderCreateModel = new FolderCreateModel();
  // folderTranslations: FormArray = new FormArray([]);
  selectedLanguage: number;

  get languages() {
    return applicationLanguages;
  }

  constructor(
    private foldersService: FoldersService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    localeService: LocaleService
  ) {
    this.selectedLanguage = applicationLanguages.find(
      (x) => x.locale === localeService.getCurrentUserLocale()
    ).id;
  }

  ngOnInit(): void {}

  show(selectedFolder?: FolderDto) {
    if (selectedFolder) {
      this.selectedParentFolder = selectedFolder;
    }
    this.initCreateForm();
    this.frame.show();
  }

  initCreateForm() {
    this.newFolderModel = new FolderCreateModel();
    for (const language of applicationLanguages) {
      this.newFolderModel = {
        ...this.newFolderModel,
        translations: [
          ...this.newFolderModel.translations,
          { languageId: language.id, description: '', name: '' },
        ],
      };
    }
  }

  hide() {
    this.selectedParentFolder = null;
    this.frame.hide();
  }

  createFolder() {
    // Validate if at least one translation is filled correctly
    const translationExists = this.newFolderModel.translations.find(
      (x) => x.name
    );
    if (translationExists) {
      this.foldersService
        .createFolder({
          translations: this.newFolderModel.translations,
          parentId: this.selectedParentFolder
            ? this.selectedParentFolder.id
            : null,
        })
        .subscribe((data) => {
          if (data && data.success) {
            this.selectedParentFolder = null;
            this.initCreateForm();
            this.folderCreated.emit();
            this.frame.hide();
          }
        });
    } else {
      this.toastrService.error(
        this.translateService.instant(
          'Folder translations should have at least one name/description pair'
        )
      );
      return;
    }
  }

  // isDisabled(): boolean {
  //   if (this.newFolderForm.get('name').value && this.newFolderModel.description) {
  //     const div = document.createElement('div');
  //     div.innerHTML = this.newFolderModel.description;
  //     const description = div.textContent;
  //     div.remove();
  //     return !(
  //       !this.isEmpty(this.newFolderModel.name) && !this.isEmpty(description)
  //     );
  //   }
  //   return true;
  // }
  //
  // isEmpty(str: string): boolean {
  //   if (str) {
  //     return str.trim() === '';
  //   }
  //   return true;
  // }

  onLanguageChanged(languageId: number) {}
}
