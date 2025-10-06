import { Injectable, inject } from '@angular/core';
import {Observable, } from 'rxjs';
import {EFormService} from 'src/app/common/services';
import {
  CommonPaginationState,
  FiltrationStateModel,
  OperationDataResult,
  TemplateListModel,
  TemplateRequestModel,
} from 'src/app/common/models';
import {arrayToggle, updateTableSort} from 'src/app/common/helpers';
import {Store} from '@ngrx/store';
import {
  AppState,
  selectEformsFilters,
  selectEformsPagination,
  updateEformFilters,
  updateEformPagination
} from 'src/app/state';

@Injectable({providedIn: 'root'})
export class EformsStateService {
  private store = inject<Store<AppState>>(Store);
  private service = inject(EFormService);

  private selectEformsPagination$ = this.store.select(selectEformsPagination);
  private selectEformsFilters$ = this.store.select(selectEformsFilters);
  private currentFilters: FiltrationStateModel = new FiltrationStateModel();
  private currentPagination: CommonPaginationState = new CommonPaginationState();

  constructor() {
    this.selectEformsPagination$.subscribe(x => this.currentPagination = x);
    this.selectEformsFilters$.subscribe(x => this.currentFilters = x);
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch(updateEformFilters({filters: {...this.currentFilters, nameFilter: nameFilter}}));
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.currentPagination.sort,
      this.currentPagination.isSortDsc
    );
    this.store.dispatch(updateEformPagination({
      pagination: {
        ...this.currentPagination,
        sort: localPageSettings.sort,
        isSortDsc: localPageSettings.isSortDsc,
      }}));
  }

  addOrRemoveTagIds(id: number) {
    this.store.dispatch(updateEformFilters({filters: {...this.currentFilters, tagIds: arrayToggle(this.currentFilters.tagIds, id)}}));
  }

  updateTagIds(tagIds: number[]) {
    this.store.dispatch(updateEformFilters({filters: {...this.currentFilters, tagIds: tagIds}}));
  }

  loadAllTemplates(): Observable<OperationDataResult<TemplateListModel>> {
    const templateRequestModel: TemplateRequestModel = {
      nameFilter: this.currentFilters.nameFilter,
      tagIds: this.currentFilters.tagIds,
      sort: this.currentPagination.sort,
      isSortDsc: this.currentPagination.isSortDsc,
      offset: 0,
      pageIndex: 0,
      pageSize: 100000,
    };
    return this.service.getAll(templateRequestModel);
  }
}


