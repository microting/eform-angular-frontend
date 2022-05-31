import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EFormService } from 'src/app/common/services';
import {
  OperationDataResult,
  SortModel,
  TemplateListModel,
} from 'src/app/common/models';
import { arrayToggle } from '@datorama/akita';
import { EformsStore, EformsQuery } from '../store';
import { updateTableSort } from 'src/app/common/helpers';

@Injectable({ providedIn: 'root' })
export class EformsStateService {
  constructor(
    private store: EformsStore,
    private service: EFormService,
    private query: EformsQuery
  ) {}

/*  getSort(): Observable<SortModel> {
    return this.query.selectSort$;
  }*/

  getActiveSort(): Observable<string> {
    return this.query.selectActiveSort$;
  }

  getActiveSortDirection(): Observable<'asc' | 'desc'> {
    return this.query.selectActiveSortDirection$;
  }

  getTagIds(): Observable<number[]> {
    return this.query.selectTagIds$;
  }

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }

  updateNameFilter(nameFilter: string) {
    this.store.update((state) => ({
      filters: { ...state.filters, nameFilter: nameFilter },
    }));
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.pagination.sort,
      this.query.pageSetting.pagination.isSortDsc
    );
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        isSortDsc: localPageSettings.isSortDsc,
        sort: localPageSettings.sort,
      },
    }));
  }

  addOrRemoveTagIds(id: number) {
    this.store.update((state) => ({
      filters: {
        ...state.filters,
        tagIds: arrayToggle(state.filters.tagIds, id),
      },
    }));
  }

  updateTagIds(tagIds: number[]) {
    this.store.update((state) => ({
      filters: { ...state.filters, tagIds: tagIds },
    }));
  }

  loadAllTemplates(): Observable<OperationDataResult<TemplateListModel>> {
    return this.service.getAll({
      ...this.query.pageSetting.pagination,
      ...this.query.pageSetting.filters,
      offset: 0,
      pageIndex: 0,
      pageSize: 100000,
    });
  }
}
