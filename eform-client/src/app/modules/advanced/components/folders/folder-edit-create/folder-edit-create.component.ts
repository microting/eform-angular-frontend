import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { applicationLanguages } from 'src/app/common/const';
import { FoldersService, LocaleService } from 'src/app/common/services';
import {
  FolderDto,
  FolderModel,
  FolderUpdateModel,
} from 'src/app/common/models';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@AutoUnsubscribe()
@Component({
  selector: 'app-folder-edit-create',
  templateUrl: './folder-edit-create.component.html',
  styleUrls: ['./folder-edit-create.component.scss'],
})
export class FolderEditCreateComponent implements OnInit, OnDestroy {
  selectedLanguage: number;
  selectedParentFolder: FolderModel;
  folderUpdateCreateModel = new FolderUpdateModel()
  edit = false;

  getFolderSub$: Subscription;
  updateFolderSub$: Subscription;
  getParentFolderSub$: Subscription;

  get languages() {
    return applicationLanguages;
  }

  getParentTranslation(): string {
    if(this.selectedParentFolder && this.selectedLanguage){
      const i = this.selectedParentFolder.translations.findIndex(x => x.languageId === this.selectedLanguage);
      if(i !== -1) {
        return this.selectedParentFolder.translations[i].name;
      }
    }
    return '';
  }

  constructor(
    private foldersService: FoldersService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    localeService: LocaleService,
    public dialogRef: MatDialogRef<FolderEditCreateComponent>,
    @Inject(MAT_DIALOG_DATA) data: {folder?: FolderDto, create: boolean}
  ) {
    this.selectedLanguage = applicationLanguages.find(
      (x) => x.locale === localeService.getCurrentUserLocale()
    ).id;
    if(!data.create) {
      this.edit = true;
      this.getParentFolder(data.folder.parentId)
      this.getFolder(data.folder.id);
    } else {
      this.edit = false;
      this.getParentFolder(data.folder?.id)
      this.initEditForm({
        id: 0,
        translations: [],
        parentId: data.folder ? data.folder.id : null,
      });
    }
  }

  ngOnInit() {}

  initEditForm(model: FolderModel) {
    this.folderUpdateCreateModel = {
      id: model.id,
      translations: [],
      parentId: model.parentId,
    };

    if(this.edit) {
      for (let i = 0; i < applicationLanguages.length; i++) {
        const translations = model.translations.find(
          (x) => x.languageId === applicationLanguages[i].id
        );
        this.folderUpdateCreateModel.translations.push({
          languageId: applicationLanguages[i].id,
          description: translations ? translations.description : '',
          name: translations ? translations.name : '',
        });
      }
    } else {
      let translations = [];
      for (const language of applicationLanguages) {
        translations = [...translations, {languageId: language.id, description: '', name: ''},];
      }
      this.folderUpdateCreateModel.translations = translations;
    }
  }

  getFolder(folderId: number) {
    this.getFolderSub$ = this.foldersService
      .getSingleFolder(folderId)
      .subscribe((data) => {
        if (data && data.success) {
          this.initEditForm(data.model);
        }
      });
  }

  getParentFolder(parentFolderId: number) {
    if(parentFolderId) {
      this.getParentFolderSub$ = this.foldersService
        .getSingleFolder(parentFolderId)
        .subscribe((data) => {
          if (data && data.success) {
            this.selectedParentFolder = data.model;
          }
        });
    }
  }

  updateFolder() {
    // Validate if at least one translation is filled correctly
    const translationExists = this.folderUpdateCreateModel.translations.find(
      (x) => x.name
    );

    if (translationExists) {
      this.updateFolderSub$ = this.foldersService
        .updateSingleFolder(this.folderUpdateCreateModel)
        .subscribe((operation) => {
          if (operation && operation.success) {
            this.hide(true);
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

  createFolder() {
    // Validate if at least one translation is filled correctly
    const translationExists = this.folderUpdateCreateModel.translations.find(
      (x) => x.name
    );
    if (translationExists) {
      this.foldersService
        .createFolder({
          translations: this.folderUpdateCreateModel.translations,
          parentId: this.folderUpdateCreateModel.parentId
            ? this.folderUpdateCreateModel.parentId
            : null,
        })
        .subscribe((data) => {
          if (data && data.success) {
            this.hide(true);
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

  hide(result = false) {
    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {}
}
