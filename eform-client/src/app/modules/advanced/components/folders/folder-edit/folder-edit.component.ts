import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FoldersService} from '../../../../../common/services/advanced/folders.service';
import {FolderDto} from '../../../../../common/models/dto/folder.dto';
import {FolderModel} from '../../../../../common/models/advanced/folder.model';

@Component({
  selector: 'app-folder-edit',
  templateUrl: './folder-edit.component.html',
  styleUrls: ['./folder-edit.component.scss']
})
export class FolderEditComponent implements OnInit {
  @Input() selectedFolderDto: FolderDto = new FolderDto();
  @Output() onFolderEdited: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  folderModel: FolderModel = new FolderModel();
  spinnerStatus = false;


  constructor(private foldersService: FoldersService) { }

  ngOnInit() {
  }
  show() {
    this.frame.show();
  }

  updateFolder() {
    this.folderModel.id = this.selectedFolderDto.id;
    this.folderModel.description = this.selectedFolderDto.description;
    this.folderModel.name = this.selectedFolderDto.name;
    this.foldersService.updateSingleFolder(this.folderModel).subscribe(operation => {
      if (operation && operation.success) {
        this.onFolderEdited.emit();
        this.frame.hide();
      }
    });
  }
}
