import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import {Subscription, take} from 'rxjs';
import { FoldersService, LocaleService } from 'src/app/common/services';
import {
  FolderDto,
  FolderModel,
  FolderUpdateModel, LanguagesModel,
} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {tap} from 'rxjs/operators';
import {AppSettingsStateService} from 'src/app/modules/application-settings/components/store';
import {selectCurrentUserLanguageId, selectCurrentUserLocale} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@AutoUnsubscribe()
@Component({
    selector: 'app-folder-edit-create',
    templateUrl: './folder-edit-create.component.html',
    styleUrls: ['./folder-edit-create.component.scss'],
    standalone: false
})
export class FolderEditCreateComponent implements OnInit, OnDestroy {
  private foldersService = inject(FoldersService);
  private authStore = inject(Store);
  private toastrService = inject(ToastrService);
  private translateService = inject(TranslateService);
  private _localeService = inject(LocaleService);
  dialogRef = inject<MatDialogRef<FolderEditCreateComponent>>(MatDialogRef);
  private appSettingsStateService = inject(AppSettingsStateService);

  selectedLanguageId: number;
  selectedParentFolder: FolderModel;
  folderUpdateCreateModel = new FolderUpdateModel()
  edit = false;
  appLanguages: LanguagesModel = new LanguagesModel();

  getFolderSub$: Subscription;
  updateFolderSub$: Subscription;
  getParentFolderSub$: Subscription;
  getLanguagesSub$: Subscription;
  localeService: LocaleService;
  activeLanguages: Array<any> = [];
  private selectCurrentUserLanguageId$ = this.authStore.select(selectCurrentUserLanguageId);

  get languages() {
    if (!this.appLanguages.languages) {
      return [];
    }
    return this.appLanguages.languages.filter((x) => x.isActive);
  }

  getParentTranslation(): string {
    if(this.selectedParentFolder && this.selectedLanguageId){
      const i = this.selectedParentFolder.translations.findIndex(x => x.languageId === this.selectedLanguageId);
      if(i !== -1) {
        return this.selectedParentFolder.translations[i].name;
      }
    }
    return '';
  }

  constructor() {
    const _localeService = this._localeService;
    const data = inject<{
    folder?: FolderDto;
    create: boolean;
}>(MAT_DIALOG_DATA);

    this.localeService = _localeService;
    this.getEnabledLanguages(data);

    // if(!data.create) {
    //   this.edit = true;
    //   this.getParentFolder(data.folder.parentId)
    //   this.getFolder(data.folder.id);
    // } else {
    //   this.edit = false;
    //   this.getParentFolder(data.folder?.id)
    //   this.initEditForm({
    //     id: 0,
    //     translations: [],
    //     parentId: data.folder ? data.folder.id : null,
    //   });
    // }
  }

  ngOnInit() {}

  initEditForm(model: FolderModel) {
    this.folderUpdateCreateModel = {
      id: model.id,
      translations: [],
      parentId: model.parentId,
    };

    if(this.edit) {
      for (let i = 0; i < this.appLanguages.languages.length; i++) {
        const translations = model.translations.find(
          (x) => x.languageId === this.appLanguages.languages[i].id
        );
        this.folderUpdateCreateModel.translations.push({
          languageId: this.appLanguages.languages[i].id,
          description: translations ? translations.description : '',
          name: translations ? translations.name : '',
        });
      }
    } else {
      let translations = [];
      for (const language of this.appLanguages.languages) {
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

  getEnabledLanguages(argument:  {folder?: FolderDto, create: boolean}) {
    this.getLanguagesSub$ = this.appSettingsStateService.getLanguages()
      .pipe(tap(data => {
        if (data && data.success && data.model) {
          this.appLanguages = data.model;
          this.activeLanguages = this.appLanguages.languages.filter((x) => x.isActive);
          // this.selectCurrentUserLocale$.pipe(take(1)).subscribe((locale) => {
          //   this.selectedLanguage =
          //     this.appLanguages.languages.find(
          //       (x) => x.languageCode === locale
          //     ).id;
          // });
          this.selectCurrentUserLanguageId$.subscribe((languageId) => {
            this.selectedLanguageId = languageId;
          });
          // this.selectedLanguage = this.appLanguages.languages.find(
          //   (x) => x.languageCode === this.localeService.getCurrentUserLocale()
          // ).id;
          if(!argument.create) {
            this.edit = true;
            this.getParentFolder(argument.folder.parentId)
            this.getFolder(argument.folder.id);
          } else {
            this.edit = false;
            this.getParentFolder(argument.folder?.id)
            this.initEditForm({
              id: 0,
              translations: [],
              parentId: argument.folder ? argument.folder.id : null,
            });
          }
        }
      })).subscribe();
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {}
}
