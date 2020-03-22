import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationPages} from 'src/app/common/const';
import {
  AdvEntitySearchableGroupListModel,
  AdvEntitySearchableGroupListRequestModel, AdvEntitySearchableGroupModel,
  AdvEntitySelectableGroupModel,
  PageSettingsModel
} from 'src/app/common/models';
import {EntitySearchService} from 'src/app/common/services/advanced';
import {AuthService, UserSettingsService} from 'src/app/common/services/auth';

@Component({
  selector: 'app-searchable-list',
  templateUrl: './entity-search.component.html',
  styleUrls: ['./entity-search.component.scss']
})
export class EntitySearchComponent implements OnInit {
  @ViewChild(('modalSearchRemove'), {static: false}) modalSearchRemove;
  @ViewChild(('modalSearchCreate'), {static: false}) modalSearchCreate;
  @ViewChild(('modalSearchEdit'), {static: false}) modalSearchEdit;
  spinnerStatus: boolean;
  selectedAdvGroup: AdvEntitySearchableGroupModel = new AdvEntitySearchableGroupModel();
  advEntitySearchableGroupListModel: AdvEntitySearchableGroupListModel = new AdvEntitySearchableGroupListModel();
  advEntitySearchableGroupListRequestModel: AdvEntitySearchableGroupListRequestModel
    = new AdvEntitySearchableGroupListRequestModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();

  get userClaims() { return this.authService.userClaims; }

  constructor(private entitySearchService: EntitySearchService, private authService: AuthService, public userSettingsService: UserSettingsService) {
  }

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.userSettingsService.getLocalPageSettings
    ('pagesSettings', ApplicationPages[ApplicationPages.EntitySearch])
      .settings;
    this.getEntitySearchableGroupList();
  }

  updateLocalPageSettings(localStorageItemName: string) {
    this.userSettingsService.updateLocalPageSettings
    (localStorageItemName, this.localPageSettings, ApplicationPages[ApplicationPages.EntitySearch]);
    this.getLocalPageSettings();
  }

  getEntitySearchableGroupList() {
    this.spinnerStatus = true;
    this.advEntitySearchableGroupListRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.advEntitySearchableGroupListRequestModel.sort = this.localPageSettings.sort;
    this.advEntitySearchableGroupListRequestModel.pageSize = this.localPageSettings.pageSize;
    this.entitySearchService.getEntitySearchableGroupList(this.advEntitySearchableGroupListRequestModel).subscribe((data) => {
      if (data && data.model) {
        this.advEntitySearchableGroupListModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.advEntitySearchableGroupListRequestModel.offset = e;
      if (e === 0) {
        this.advEntitySearchableGroupListRequestModel.pageIndex = 0;
      } else {
        this.advEntitySearchableGroupListRequestModel.pageIndex
          = Math.floor(e / this.advEntitySearchableGroupListRequestModel.pageSize);
      }
      this.getEntitySearchableGroupList();
    }
  }

  openModalSearchRemove(selectedSearchModel: AdvEntitySearchableGroupModel) {
    this.selectedAdvGroup = selectedSearchModel;
    this.modalSearchRemove.show(this.selectedAdvGroup);
  }

  openModalSearchCreate() {
    this.modalSearchCreate.show();
  }

  openModalSearchEdit(selectedSearchModel: AdvEntitySearchableGroupModel) {
    this.selectedAdvGroup = selectedSearchModel;
    this.modalSearchEdit.show(this.selectedAdvGroup.microtingUUID);
  }


  onSearchChanged(e: any) {
    this.advEntitySearchableGroupListRequestModel.nameFilter = e;
    this.changePage(0);
  }

  onEntitySearchableGroupListRequestChanged(e: any) {
    this.advEntitySearchableGroupListRequestModel = e;
    this.getEntitySearchableGroupList();
  }

  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings('pagesSettings');
  }
}
