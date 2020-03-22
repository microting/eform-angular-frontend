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

  @ViewChild(('modalFolderCreate'), {static: false}) modalFolderCreate;
  @ViewChild(('modalFolderEdit'), {static: false}) modalFolderEdit;
  @ViewChild(('modalFolderDelete'), {static: false}) modalFolderDelete;

  selectedFolder: FolderDto = new FolderDto();
  spinnerStatus = true;
  foldersDto: Array<FolderDto> = [];

  get userClaims() { return this.authService.userClaims; }

  ngOnInit(): void {
    this.loadAllFolders();
  }

  constructor(private foldersService: FoldersService,
              private router: Router,
              private authService: AuthService) {
  }

  openCreateModal() {
    this.modalFolderCreate.show();
  }
  openEditModal(selectedFolder: FolderDto) {
    this.selectedFolder = selectedFolder;
    this.modalFolderEdit.show();
  }
  openDeleteModal(selectedFolder: FolderDto) {
    this.selectedFolder = selectedFolder;
    this.modalFolderDelete.show();
  }

  loadAllFolders() {
    this.spinnerStatus = true;
    this.foldersService.getAllFolders().subscribe((operation) => {
      if (operation && operation.success) {
        this.foldersDto = operation.model;
      }
      this.spinnerStatus = false;
    });
  }
}
