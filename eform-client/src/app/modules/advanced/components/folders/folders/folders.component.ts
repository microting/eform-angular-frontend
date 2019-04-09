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

  @ViewChild('modalFolderCreate') modalFolderCreate;

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
