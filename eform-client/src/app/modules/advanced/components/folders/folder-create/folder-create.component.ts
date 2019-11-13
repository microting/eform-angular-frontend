import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FoldersService} from '../../../../../common/services/advanced/folders.service';
import {FolderCreateModel} from '../../../../../common/models/advanced/folder-create.model';

@Component({
  selector: 'app-folder-create',
  templateUrl: './folder-create.component.html'
})

export class FolderCreateComponent implements OnInit {
  @Output() FolderCreated: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  newFolderModel: FolderCreateModel = new FolderCreateModel;
  spinnerStatus = false;

  constructor(private foldersService: FoldersService) { }

  ngOnInit(): void {
  }

  show() {
    this.frame.show();
  }

  createFolder() {
    this.spinnerStatus = true;
    debugger;
    this.foldersService.createFolder(this.newFolderModel).subscribe((data => {
      if (data && data.success) {
        this.newFolderModel = new FolderCreateModel();
        this.FolderCreated.emit();
        this.frame.hide();
      }
      this.spinnerStatus = false;
    }));
  }

}
