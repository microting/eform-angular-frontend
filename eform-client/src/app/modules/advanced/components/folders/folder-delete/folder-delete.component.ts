import {Component, Inject, OnInit,} from '@angular/core';
import {FoldersService} from 'src/app/common/services';
import {FolderDto} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-folder-delete',
    templateUrl: './folder-delete.component.html',
    styleUrls: ['./folder-delete.component.scss'],
    standalone: false
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
