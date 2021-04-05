import { Injectable } from '@angular/core';
import { EntitySearchStore } from './entity-search.store';
import { EntitySearchService } from 'src/app/common/services';
import {
  AdvEntitySearchableGroupListModel,
  OperationDataResult,
} from 'src/app/common/models';
import { Observable } from 'rxjs';
import { EntitySearchQuery } from 'src/app/modules/advanced/components/entity-search/state/entity-search.query';

@Injectable({ providedIn: 'root' })
export class EntitySearchStateService {
  constructor(
    private entitySearchStore: EntitySearchStore,
    private entitySearchService: EntitySearchService,
    private entitySearchQuery: EntitySearchQuery
  ) {}

  getEntitySearchableGroupList(): Observable<
    OperationDataResult<AdvEntitySearchableGroupListModel>
  > {
    return this.entitySearchService.getEntitySearchableGroupList(
      this.entitySearchQuery.pageSetting
    );
  }

  updatePageIndex(offset: number) {
    this.entitySearchStore.update({
      pageIndex: offset / this.entitySearchQuery.pageSetting.pageSize,
    });
  }

  updateNameFilter(nameFilter: string) {
    this.entitySearchStore.update({ nameFilter: nameFilter });
  }

  get sort(): string {
    return this.entitySearchQuery.pageSetting.sort;
  }

  get isSortDsc(): boolean {
    return this.entitySearchQuery.pageSetting.isSortDsc;
  }

  updateSort(sort: string) {
    this.entitySearchStore.update({ sort: sort });
  }

  updateIsSortDsc(isSortDsc: boolean) {
    this.entitySearchStore.update({ isSortDsc: isSortDsc });
  }

  updatePageSize(pageSize: number) {
    this.entitySearchStore.update({ pageSize: pageSize });
  }

  getOffset(): number {
    return this.entitySearchQuery.pageOffset;
  }

  getPageSize(): Observable<number> {
    return this.entitySearchQuery.selectPageSize$;
  }

  getSort(): Observable<string> {
    return this.entitySearchQuery.selectSort$;
  }

  getIsSortDsc(): Observable<boolean> {
    return this.entitySearchQuery.selectIsSortDsc$;
  }

  getNameFilter(): Observable<string> {
    return this.entitySearchQuery.selectNameFilter$;
  }
}
