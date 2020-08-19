import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FoldersService} from '../../../../../common/services/advanced/folders.service';
import {FolderDto} from '../../../../../common/models/dto/folder.dto';
import {FolderUpdateModel} from '../../../../../common/models/advanced/folderUpdateModel';

@Component({
  selector: 'app-folder-edit',
  templateUrl: './folder-edit.component.html',
  styleUrls: ['./folder-edit.component.scss']
})
export class FolderEditComponent implements OnInit {
  @Input() selectedFolderDto: FolderDto = new FolderDto();
  @Output() folderEdited: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  folderModel: FolderUpdateModel = new FolderUpdateModel();


  constructor(private foldersService: FoldersService) { }

  ngOnInit() {
  }

  show(selectedFolder: FolderDto) {
    this.frame.show();
    this.folderModel.id = selectedFolder.id;
    this.folderModel.description = selectedFolder.description;
    this.folderModel.name = selectedFolder.name;
    this.folderModel.parentId = selectedFolder.parentId;
  }

  updateFolder() {
    this.foldersService.updateSingleFolder(this.folderModel).subscribe(operation => {
      if (operation && operation.success) {
        this.folderEdited.emit();
        this.frame.hide();
      }
    });
  }
}
