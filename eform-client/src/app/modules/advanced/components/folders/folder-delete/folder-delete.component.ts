import {Component, Inject, OnInit,} from '@angular/core';
import {FoldersService} from 'src/app/common/services';
import {FolderDto} from 'src/app/common/models';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-folder-delete',
  templateUrl: './folder-delete.component.html',
  styleUrls: ['./folder-delete.component.scss']
})
export class FolderDeleteComponent implements OnInit {
  constructor(private folderService: FoldersService,
  public dialogRef: MatDialogRef<FolderDeleteComponent>,
  @Inject(MAT_DIALOG_DATA) public selectedFolderDto: FolderDto = new FolderDto()) { }

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
