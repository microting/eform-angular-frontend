import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FoldersService} from '../../../../../common/services/advanced/folders.service';
import {FolderDto} from '../../../../../common/models/dto/folder.dto';

@Component({
  selector: 'app-folder-delete',
  templateUrl: './folder-delete.component.html',
  styleUrls: ['./folder-delete.component.scss']
})
export class FolderDeleteComponent implements OnInit {
 @Input() selectedFolderDto: FolderDto = new FolderDto();
 @Output() onFolderDeleted: EventEmitter<void> = new EventEmitter<void>();
 @ViewChild('frame', { static: true }) frame;

  constructor(private folderService: FoldersService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  deleteFolder() {
    this.folderService.deleteSingleFolder(this.selectedFolderDto.id).subscribe(operation => {
      if (operation && operation.success) {
        this.frame.hide();
        this.onFolderDeleted.emit();
      }
    });
  }
}
