import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WorkOrdersSettingsModel} from '../../../models';
import {WorkOrdersSettingsService} from '../../../services';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {SettingsRemoveSiteModalComponent} from '../settings-remove-site-modal/settings-remove-site-modal.component';
import {SettingsAddSiteModalComponent} from '../settings-add-site-modal/settings-add-site-modal.component';
import {SitesService} from 'src/app/common/services/advanced';
import {SiteNameDto} from 'src/app/common/models';
import {FolderDto} from 'src/app/common/models/dto/folder.dto';
import {FoldersService} from 'src/app/common/services/advanced/folders.service';
import { WorkOrdersFoldersModalComponent } from '../workorders-folders-modal/workorders-folders-modal.component';
import {composeFolderName} from 'src/app/common/helpers/folder-name.helper';

@AutoUnsubscribe()
@Component({
  selector: 'app-workorders-settings',
  templateUrl: './workorders-settings.component.html',
  styleUrls: ['./workorders-settings.component.scss'],
})
export class WorkOrdersSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('removeSiteModal') removeSiteModal: SettingsRemoveSiteModalComponent;
  @ViewChild('addSiteModal') addSiteModal: SettingsAddSiteModalComponent;
  @ViewChild('foldersModal', {static: false}) foldersModal: WorkOrdersFoldersModalComponent;
  workOrdersSettingsModel: WorkOrdersSettingsModel = new WorkOrdersSettingsModel();
  sites: SiteNameDto[] = [];
  foldersTreeDto: FolderDto[] = [];
  foldersDto: FolderDto[] = [];
  settingsSub$: Subscription;
  sitesSub$: Subscription;
  foldersSubTree$: Subscription;
  foldersSub$: Subscription;
  folderUpdateSub$: Subscription;
  tasksFolder: boolean;

  // tslint:disable-next-line:max-line-length
  constructor(private settingsService: WorkOrdersSettingsService, private sitesService: SitesService, private foldersService: FoldersService) {}

  ngOnInit(): void {
    this.getSettings();
  }

  getSettings() {
    this.settingsSub$ = this.settingsService
      .getAllSettings()
      .subscribe((data) => {
        if (data && data.success) {
          this.workOrdersSettingsModel = data.model;

          this.loadAllFoldersTree();
        }
      });
  }


  getSites() {
    this.sitesSub$ = this.sitesService.getAllSites().subscribe((data) => {
      if (data && data.success) {
        this.sites = data.model;
        this.loadFlatFolders();
      }
    });
  }

  loadAllFoldersTree() {
    this.foldersSubTree$ = this.foldersService.getAllFolders().subscribe((operation) => {
      if (operation && operation.success) {
        this.foldersTreeDto = operation.model;

        this.getSites();
      }
    });
  }

  loadFlatFolders() {
    this.foldersSub$ = this.foldersService.getAllFoldersList().subscribe((operation) => {
      if (operation && operation.success) {
        this.foldersDto = operation.model;
        this.workOrdersSettingsModel.folderId === null ?
          this.workOrdersSettingsModel.folderName = null :
          this.workOrdersSettingsModel.folderName = composeFolderName(this.workOrdersSettingsModel.folderId, this.foldersDto);
        this.workOrdersSettingsModel.folderTasksId === null ?
          this.workOrdersSettingsModel.folderTasksName = null :
          this.workOrdersSettingsModel.folderTasksName = this.foldersDto.find(x =>
            x.id === this.workOrdersSettingsModel.folderTasksId).name;
      }
    });
  }

  showAddNewSiteModal() {
    this.addSiteModal.show(this.sites, this.workOrdersSettingsModel.assignedSites);
  }

  showRemoveSiteModal(selectedSite: SiteNameDto) {
    this.removeSiteModal.show(selectedSite);
  }

  openFoldersModal() {
    this.tasksFolder = false;
    this.foldersModal.show(this.workOrdersSettingsModel.folderId);
  }
  openTasksFoldersModal() {
    this.tasksFolder = true;
    this.foldersModal.show(this.workOrdersSettingsModel.folderTasksId);
  }

  onFolderSelected(folderDto: FolderDto) {
    if (this.tasksFolder) {
      this.folderUpdateSub$ = this.settingsService.updateSettingsTasksFolder(folderDto.id).subscribe((operation) => {
        if (operation && operation.success) {
          this.getSettings();
        }
      });
    } else {
      this.folderUpdateSub$ = this.settingsService.updateSettingsFolder(folderDto.id).subscribe((operation) => {
        if (operation && operation.success) {
          this.getSettings();
        }
      });
    }
  }

  ngOnDestroy(): void {}
}
