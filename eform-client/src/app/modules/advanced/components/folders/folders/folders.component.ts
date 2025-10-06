import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FoldersService } from 'src/app/common/services';
import {FolderDto, LanguagesModel} from 'src/app/common/models';
import { AuthStateService } from 'src/app/common/store';
import {FolderDeleteComponent, FolderEditCreateComponent} from '../';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import {Store} from "@ngrx/store";
import {selectCurrentUserClaimsWorkersCreate} from 'src/app/state/auth/auth.selector';

@Component({
    selector: 'app-folders',
    templateUrl: './folders.component.html',
    standalone: false
})
export class FoldersComponent implements OnInit {
  private authStore = inject(Store);
  private foldersService = inject(FoldersService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);

  foldersFlatList: Array<FolderDto> = [];
  foldersDto: Array<FolderDto> = [];
  folderDeleteComponentAfterClosedSub$: Subscription;
  folderEditComponentAfterClosedSub$: Subscription;
  folderCreateComponentAfterClosedSub$: Subscription;
  public selectCurrentUserClaimsWorkersCreate$ = this.authStore.select(selectCurrentUserClaimsWorkersCreate);

  ngOnInit(): void {
    this.getInitialData();
  }

  getInitialData() {
    this.loadAllFolders();
    // this.loadAllFoldersList();
  }

  openCreateModal(selectedFolder?: FolderDto) {
    this.folderCreateComponentAfterClosedSub$ = this.dialog.open(FolderEditCreateComponent,
      {...dialogConfigHelper(this.overlay, {folder: selectedFolder, create: true}), minWidth: 500})
      .afterClosed().subscribe(data => data ? this.getInitialData() : undefined);
  }
  openEditModal(selectedFolder: FolderDto) {
    this.folderEditComponentAfterClosedSub$ = this.dialog.open(FolderEditCreateComponent,
      {...dialogConfigHelper(this.overlay, {folder: selectedFolder, create: false}), minWidth: 500})
      .afterClosed().subscribe(data => data ? this.getInitialData() : undefined);
  }
  openDeleteModal(selectedFolder: FolderDto) {
    this.folderDeleteComponentAfterClosedSub$ = this.dialog.open(FolderDeleteComponent,
      dialogConfigHelper(this.overlay, selectedFolder))
      .afterClosed().subscribe(data => data ? this.getInitialData() : undefined);
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
