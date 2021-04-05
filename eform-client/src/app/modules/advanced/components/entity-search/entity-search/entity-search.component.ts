import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AdvEntitySearchableGroupListModel,
  AdvEntitySearchableGroupListRequestModel,
  AdvEntitySearchableGroupModel,
  PageSettingsModel,
  TableHeaderElementModel,
} from 'src/app/common/models';
import { EntitySearchService } from 'src/app/common/services/advanced';
import { AuthService } from 'src/app/common/services/auth';
import { EntitySearchStateService } from 'src/app/modules/advanced/components/entity-search/state/entity-search-state.service';
import { EntitySearchQuery } from 'src/app/modules/advanced/components/entity-search/state/entity-search.query';
import { EntitySearchStore } from 'src/app/modules/advanced/components/entity-search/state/entity-search.store';
import { updateTableSorting } from 'src/app/common/helpers';

@Component({
  selector: 'app-searchable-list',
  templateUrl: './entity-search.component.html',
  styleUrls: ['./entity-search.component.scss'],
})
export class EntitySearchComponent implements OnInit {
  @ViewChild('modalSearchRemove', { static: true }) modalSearchRemove;
  selectedAdvGroup: AdvEntitySearchableGroupModel = new AdvEntitySearchableGroupModel();
  advEntitySearchableGroupListModel: AdvEntitySearchableGroupListModel = new AdvEntitySearchableGroupListModel();

  get userClaims() {
    return this.authService.userClaims;
  }

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    { name: 'Name', elementId: 'nameTableHeader', sortable: false },
    {
      name: 'Description',
      elementId: 'descriptionTableHeader',
      sortable: false,
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(
    private entitySearchService: EntitySearchService,
    private authService: AuthService,
    public entitySearchStateService: EntitySearchStateService
  ) {}

  ngOnInit() {
    this.getEntitySearchableGroupList();
  }

  getEntitySearchableGroupList() {
    this.entitySearchStateService
      .getEntitySearchableGroupList()
      .subscribe((data) => {
        if (data && data.model) {
          this.advEntitySearchableGroupListModel = data.model;
        }
      });
  }

  changePage(offset: number) {
    this.entitySearchStateService.updatePageIndex(offset);
    this.getEntitySearchableGroupList();
  }

  openModalSearchRemove(selectedSearchModel: AdvEntitySearchableGroupModel) {
    this.selectedAdvGroup = selectedSearchModel;
    this.modalSearchRemove.show(this.selectedAdvGroup);
  }

  onSearchChanged(name: string) {
    this.entitySearchStateService.updateNameFilter(name);
    this.changePage(0);
    this.getEntitySearchableGroupList();
  }

  sortTable(sort: string) {
    const localPageSettings = updateTableSorting(sort, {
      sort: this.entitySearchStateService.sort,
      isSortDsc: this.entitySearchStateService.isSortDsc,
      pageSize: 0,
      additional: [],
    });
    this.entitySearchStateService.updateSort(localPageSettings.sort);
    this.entitySearchStateService.updateIsSortDsc(localPageSettings.isSortDsc);
    this.getEntitySearchableGroupList();
  }

  onPageSizeChanged(pageSize: number) {
    this.entitySearchStateService.updatePageSize(pageSize);
    this.getEntitySearchableGroupList();
  }
}
