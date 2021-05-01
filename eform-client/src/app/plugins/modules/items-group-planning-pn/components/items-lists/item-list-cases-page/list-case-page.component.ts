import {Component, OnInit, ViewChild} from '@angular/core';
import {SharedPnService} from '../../../../shared/services';
import {ActivatedRoute} from '@angular/router';
import {PageSettingsModel} from '../../../../../../common/models/settings';
import {ItemsListCasePnModel, ItemsListPnItemCaseModel} from '../../../models/list/items-list-case-pn.model';
import {ItemsGroupPlanningPnCasesService} from '../../../services/items-group-planning-pn-cases.service';
import {ItemListCasesPnRequestModel} from '../../../models/list/item-list-cases-pn-request.model';

@Component({
  selector: 'app-items-group-planning-pn-list-case-page',
  templateUrl: './list-case-page.component.html',
  styleUrls: ['./list-case-page.component.scss']
})

export class ListCasePageComponent implements OnInit {
  @ViewChild('uploadedDataModal', {static: false}) uploadedDataModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  listCaseRequestModel: ItemListCasesPnRequestModel = new ItemListCasesPnRequestModel();
  casesModel: ItemsListCasePnModel = new ItemsListCasePnModel();
  id: number;

  constructor(private activateRoute: ActivatedRoute,
              private sharedPnService: SharedPnService,
              private itemsGroupPlanningPnCasesService: ItemsGroupPlanningPnCasesService) {
    const activatedRouteSub = this.activateRoute.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

  ngOnInit(): void {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('itemsGroupPlanningPnSettings', 'ItemListCases').settings;
    this.getAllInitialData();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings
    ('itemsGroupPlanningPnSettings', this.localPageSettings, 'ItemListCases');
    this.getAllCases();
  }

  getAllInitialData() {
    this.getAllCases();
  }
  showListCasePdfModal(itemCase: ItemsListPnItemCaseModel) {
    this.uploadedDataModal.show(itemCase);
  }
  getAllCases() {
    this.listCaseRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.listCaseRequestModel.sort = this.localPageSettings.sort;
    this.listCaseRequestModel.pageSize = this.localPageSettings.pageSize;
    this.listCaseRequestModel.listId = this.id;
    this.itemsGroupPlanningPnCasesService.getAllCases(this.listCaseRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.casesModel = data.model;
      }
    });
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
      this.listCaseRequestModel.offset = e;
      if (e === 0) {
        this.listCaseRequestModel.pageIndex = 0;
      } else {
        this.listCaseRequestModel.pageIndex
          = Math.floor(e / this.listCaseRequestModel.pageSize);
      }
      this.getAllCases();
    }
  }
}
