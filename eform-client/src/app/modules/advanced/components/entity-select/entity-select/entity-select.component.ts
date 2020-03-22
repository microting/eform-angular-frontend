import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationPages} from 'src/app/common/const';
import {
  AdvEntitySelectableGroupListModel,
  AdvEntitySelectableGroupListRequestModel, AdvEntitySelectableGroupModel
} from 'src/app/common/models/advanced';
import {PageSettingsModel} from 'src/app/common/models/settings';
import {EntitySelectService} from 'src/app/common/services/advanced';
import {AuthService, UserSettingsService} from 'src/app/common/services/auth';

@Component({
  selector: 'app-selectable-list',
  templateUrl: './entity-select.component.html',
  styleUrls: ['./entity-select.component.scss']
})
export class EntitySelectComponent implements OnInit {
  @ViewChild(('modalSelectRemove'), {static: false}) modalSelectRemove;
  @ViewChild(('modalSelectCreate'), {static: false}) modalSelectCreate;
  @ViewChild(('modalSelectEdit'), {static: false}) modalSelectEdit;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  spinnerStatus: boolean;
  selectedAdvGroup: AdvEntitySelectableGroupModel = new AdvEntitySelectableGroupModel();
  advEntitySelectableGroupListModel: AdvEntitySelectableGroupListModel = new AdvEntitySelectableGroupListModel();
  advEntitySelectableGroupListRequestModel: AdvEntitySelectableGroupListRequestModel
    = new AdvEntitySelectableGroupListRequestModel();

  get userClaims() { return this.authService.userClaims; }

  constructor(private entitySelectService: EntitySelectService,
              private authService: AuthService,
              public userSettingsService: UserSettingsService) {}

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getEntitySelectableGroupList() {
    this.spinnerStatus = true;
    this.advEntitySelectableGroupListRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.advEntitySelectableGroupListRequestModel.sort = this.localPageSettings.sort;
    this.advEntitySelectableGroupListRequestModel.pageSize = this.localPageSettings.pageSize;
    this.entitySelectService.getEntitySelectableGroupList(this.advEntitySelectableGroupListRequestModel).subscribe((data) => {
      if (data && data.model) {
        this.advEntitySelectableGroupListModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  getLocalPageSettings() {
    this.localPageSettings = this.userSettingsService.getLocalPageSettings
    ('pagesSettings', ApplicationPages[ApplicationPages.EntitySelect])
      .settings;
    this.getEntitySelectableGroupList();
  }


  updateLocalPageSettings(localStorageItemName: string) {
    this.userSettingsService.updateLocalPageSettings
    (localStorageItemName, this.localPageSettings, ApplicationPages[ApplicationPages.EntitySelect]);
    this.getLocalPageSettings();
  }

  openModalSelectRemove(selectedSelectModel: AdvEntitySelectableGroupModel) {
    this.selectedAdvGroup = selectedSelectModel;
    this.modalSelectRemove.show(this.selectedAdvGroup);
  }

  openModalSelectCreate() {
    this.modalSelectCreate.show();
  }

  openModalSelectEdit(selectedSelectModel: AdvEntitySelectableGroupModel) {
    this.selectedAdvGroup = selectedSelectModel;
    this.modalSelectEdit.show(this.selectedAdvGroup.microtingUUID);
  }


  onSelectChanged(e: any) {
    this.advEntitySelectableGroupListRequestModel.nameFilter = e;
    this.changePage(0);
  }

  onEntitySelectableGroupListRequestChanged(e: any) {
    this.advEntitySelectableGroupListRequestModel = e;
    this.getEntitySelectableGroupList();
  }



  changePage(e: any) {
    if (e || e === 0) {
      this.advEntitySelectableGroupListRequestModel.offset = e;
      if (e === 0) {
        this.advEntitySelectableGroupListRequestModel.pageIndex = 0;
      } else {
        this.advEntitySelectableGroupListRequestModel.pageIndex
          = Math.floor(e / this.advEntitySelectableGroupListRequestModel.pageSize);
      }
      this.getEntitySelectableGroupList();
    }
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
