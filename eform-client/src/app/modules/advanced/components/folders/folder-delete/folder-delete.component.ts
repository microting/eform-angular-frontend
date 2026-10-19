import { Component, OnInit, inject } from '@angular/core';
import {FoldersService} from 'src/app/common/services';
import {FolderDto} from 'src/app/common/models';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgIf } from '@angular/common';
import { DateFormatterComponent } from '../../../../../common/modules/eform-shared/components/date-formatter/date-formatter.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-folder-delete',
    templateUrl: './folder-delete.component.html',
    styleUrls: ['./folder-delete.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, NgIf, DateFormatterComponent, MatDialogActions, TranslatePipe]
})
export class FolderDeleteComponent implements OnInit {
  private folderService = inject(FoldersService);
  dialogRef = inject<MatDialogRef<FolderDeleteComponent>>(MatDialogRef);
  selectedFolderDto = inject<FolderDto>(MAT_DIALOG_DATA) ?? new FolderDto();


  ngOnInit() {
  }


  hide(result = false) {
    this.dialogRef.close(result);
  }

  deleteFolder() {
    this.folderService.deleteSingleFolder(this.selectedFolderDto.id)
      .subscribe(operation => {
        if (operation && operation.success) {
          this.hide(true);
        }
      });
  }
}
