import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/common/services/auth';
import {FoldersService} from '../../../../../common/services/advanced/folders.service';
import {FolderDto} from '../../../../../common/models/dto/folder.dto';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html'
})

export class FoldersComponent implements OnInit {

  @ViewChild('modalFolderCreate', { static: true }) modalFolderCreate;
  @ViewChild('modalFolderEdit', { static: true }) modalFolderEdit;
  @ViewChild('modalFolderDelete', { static: true }) modalFolderDelete;

  selectedFolder: FolderDto = new FolderDto();
  spinnerStatus = true;
  foldersFlatList: Array<FolderDto> = [];
  foldersDto: Array<FolderDto> = [];

  get userClaims() { return this.authService.userClaims; }

  ngOnInit(): void {
    this.getInitialData();
  }

  getInitialData() {
    this.loadAllFolders();
    this.loadAllFoldersList();
  }

  constructor(private foldersService: FoldersService,
              private router: Router,
              private authService: AuthService) {
  }

  openCreateModal(selectedFolder?: FolderDto) {
    this.modalFolderCreate.show(selectedFolder);
  }
  openEditModal(selectedFolder: FolderDto) {
    this.modalFolderEdit.show(selectedFolder);
  }
  openDeleteModal(selectedFolder: FolderDto) {
    this.selectedFolder = selectedFolder;
    this.modalFolderDelete.show();
  }

  loadAllFolders() {
    this.foldersService.getAllFolders().subscribe((operation) => {
      if (operation && operation.success) {
        this.foldersDto = operation.model;
      }
    });
  }

  loadAllFoldersList() {
    this.foldersService.getAllFoldersList().subscribe((operation) => {
      if (operation && operation.success) {
        this.foldersFlatList = operation.model;
      }
    });
  }
}
