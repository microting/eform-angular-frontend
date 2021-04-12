import {
  Component,
  EventEmitter,
  Input,
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
import { FoldersService } from 'src/app/common/services';
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
  selectedLanguage = applicationLanguages[1].id;
  selectedParentFolder: FolderDto;

  getFolderSub$: Subscription;
  updateFolderSub$: Subscription;

  get languages() {
    return applicationLanguages;
  }

  constructor(
    private foldersService: FoldersService,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) {}

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
      translations: [...model.translations.sort((x) => x.languageId)],
    };
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
      (x) => x.name && x.description
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
