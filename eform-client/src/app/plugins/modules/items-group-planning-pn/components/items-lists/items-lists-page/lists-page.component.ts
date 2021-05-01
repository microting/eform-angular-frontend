import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from 'src/app/common/models/settings';

import {SharedPnService} from 'src/app/plugins/modules/shared/services';
import {ItemsListPnModel, ItemsListPnRequestModel, ItemsListsPnModel} from '../../../models/list';
import {ItemsGroupPlanningPnListsService} from '../../../services';
import {PluginClaimsHelper} from '../../../../../../common/helpers';
import {ItemsGroupPlanningPnClaims} from '../../../enums';

@Component({
  selector: 'app-items-group-planning-pn-lists-page',
  templateUrl: './lists-page.component.html',
  styleUrls: ['./lists-page.component.scss']
})
export class ListsPageComponent implements OnInit {
  @ViewChild('createListModal', {static: false}) createListModal;
  @ViewChild('editListModal', {static: false}) editListModal;
  @ViewChild('deleteListModal', {static: false}) deleteListModal;
  @ViewChild('modalCasesColumns', {static: false}) modalCasesColumnsModal;

  localPageSettings: PageSettingsModel = new PageSettingsModel();
  listsModel: ItemsListsPnModel = new ItemsListsPnModel();
  listRequestModel: ItemsListPnRequestModel = new ItemsListPnRequestModel();

  constructor(private sharedPnService: SharedPnService,
              private itemsGroupPlanningPnListsService: ItemsGroupPlanningPnListsService) { }

  get pluginClaimsHelper() {
    return PluginClaimsHelper;
  }

  get itemsPlanningPnClaims() {
    return ItemsGroupPlanningPnClaims;
  }

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('itemsGroupPlanningPnSettings', 'ItemLists').settings;
    this.getAllInitialData();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings
    ('itemsGroupPlanningPnSettings', this.localPageSettings, 'ItemLists');
    this.getAllLists();
  }

  getAllInitialData() {
    this.getAllLists();
  }

  getAllLists() {
    this.listRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.listRequestModel.sort = this.localPageSettings.sort;
    this.listRequestModel.pageSize = this.localPageSettings.pageSize;
    this.itemsGroupPlanningPnListsService.getAllLists(this.listRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.listsModel = data.model;
      }
    });
  }
  showEditListModal(list: ItemsListPnModel) {
    this.editListModal.show(list);
  }

  showDeleteListModal(list: ItemsListPnModel) {
    this.deleteListModal.show(list);
  }

  showCreateListModal() {
    this.createListModal.show();
  }


  openEditColumnsModal(templateId: number) {
    this.modalCasesColumnsModal.show(templateId);
  }

  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.listRequestModel.offset = e;
      if (e === 0) {
        this.listRequestModel.pageIndex = 0;
      } else {
        this.listRequestModel.pageIndex
          = Math.floor(e / this.listRequestModel.pageSize);
      }
      this.getAllLists();
    }
  }
}
