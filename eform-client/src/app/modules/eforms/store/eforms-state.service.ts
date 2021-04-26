import { Injectable } from '@angular/core';
import { EformsStore } from './eforms.store';
import { Observable } from 'rxjs';
import { EFormService } from 'src/app/common/services/eform';
import { EformsQuery } from 'src/app/modules/eforms/store/eforms.query';
import { OperationDataResult, TemplateListModel } from 'src/app/common/models';
import { arrayToggle } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class EformsStateService {
  constructor(
    private store: EformsStore,
    private service: EFormService,
    private query: EformsQuery
  ) {}

  get sort() {
    return this.query.pageSetting.pagination.sort;
  }

  get isSortDsc() {
    return this.query.pageSetting.pagination.isSortDsc;
  }

  getIsSortDsc(): Observable<boolean> {
    return this.query.selectIsSortDsc$;
  }

  getSort(): Observable<string> {
    return this.query.selectSort$;
  }

  getTagIds(): Observable<number[]> {
    return this.query.selectTagIds$;
  }

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }

  updateIsSortDsc(isSortDsc: boolean) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, isSortDsc: isSortDsc },
    }));
  }

  updateSort(sort: string) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, sort: sort },
    }));
  }

  updateNameFilter(nameFilter: string) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, nameFilter: nameFilter },
    }));
  }

  addOrRemoveTagIds(id: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        tagIds: arrayToggle(state.pagination.tagIds, id),
      },
    }));
  }

  updateTagIds(tagIds: number[]) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, tagIds: tagIds },
    }));
  }

  loadAllTemplates(): Observable<OperationDataResult<TemplateListModel>> {
    return this.service.getAll({
      isSortDsc: this.query.pageSetting.pagination.isSortDsc,
      nameFilter: this.query.pageSetting.pagination.nameFilter,
      offset: 0,
      pageIndex: 0,
      pageSize: 100000,
      sort: this.query.pageSetting.pagination.sort,
      tagIds: this.query.pageSetting.pagination.tagIds,
    });
  }
}
