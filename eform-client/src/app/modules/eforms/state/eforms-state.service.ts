import { Injectable } from '@angular/core';
import { EformsStore } from './eforms.store';
import { Observable } from 'rxjs';
import { EFormService } from 'src/app/common/services/eform';
import { EformsQuery } from 'src/app/modules/eforms/state/eforms.query';
import { OperationDataResult, TemplateListModel } from 'src/app/common/models';

@Injectable({ providedIn: 'root' })
export class EformsStateService {
  constructor(
    private store: EformsStore,
    private service: EFormService,
    private query: EformsQuery
  ) {}

  get sort() {
    return this.query.pageSetting.sort;
  }

  get isSortDsc() {
    return this.query.pageSetting.isSortDsc;
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
    this.store.update({ isSortDsc: isSortDsc });
  }

  updateSort(sort: string) {
    this.store.update({ sort: sort });
  }

  updateNameFilter(NameFilter: string) {
    this.store.update({ nameFilter: NameFilter });
  }

  addTagIds(id: number) {
    const tagIds = this.query.pageSetting.tagIds;
    this.store.update({ tagIds: [...tagIds, id] });
  }

  removeTagIds(id: number) {
    const tagIds = this.query.pageSetting.tagIds;
    this.store.update({ tagIds: tagIds.filter((x) => x !== id) });
  }

  updateTagIds(ids: number[]) {
    this.store.update({ tagIds: ids });
  }

  loadAllTemplates(): Observable<OperationDataResult<TemplateListModel>> {
    return this.service.getAll({
      isSortDsc: this.query.pageSetting.isSortDsc,
      nameFilter: this.query.pageSetting.nameFilter,
      offset: 0,
      pageIndex: 0,
      pageSize: 100000,
      sort: this.query.pageSetting.sort,
      tagIds: this.query.pageSetting.tagIds,
    });
  }
}
