import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
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

@AutoUnsubscribe()
@Component({
  selector: 'app-folder-edit',
  templateUrl: './folder-edit.component.html',
  styleUrls: ['./folder-edit.component.scss'],
})
export class FolderEditComponent implements OnInit, OnDestroy {
  @Output() folderEdited: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  folderUpdateModel: FolderUpdateModel = new FolderUpdateModel();
  selectedLanguage: number;
  selectedParentFolder: FolderDto;

  getFolderSub$: Subscription;
  updateFolderSub$: Subscription;

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

  ngOnInit() {}

  show(selectedFolder: FolderDto) {
    this.getFolder(selectedFolder.id);
    this.selectedParentFolder = selectedFolder.parent;
    this.frame.show();
  }

  initEditForm(model: FolderModel) {
    this.folderUpdateModel = new FolderUpdateModel();
    this.folderUpdateModel = {
      ...this.folderUpdateModel,
      id: model.id,
      translations: [],
    };
    for (let i = 0; i < applicationLanguages.length; i++) {
      const translations = model.translations.find(
        (x) => x.languageId === applicationLanguages[i].id
      );
      this.folderUpdateModel.translations.push({
        languageId: applicationLanguages[i].id,
        description: translations ? translations.description : '',
        name: translations ? translations.name : '',
      });
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

  updateFolder() {
    // Validate if at least one translation is filled correctly
    const translationExists = this.folderUpdateModel.translations.find(
      (x) => x.name
    );

    if (translationExists) {
      this.updateFolderSub$ = this.foldersService
        .updateSingleFolder(this.folderUpdateModel)
        .subscribe((operation) => {
          if (operation && operation.success) {
            this.folderEdited.emit();
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

  ngOnDestroy(): void {}
}
