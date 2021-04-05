import { Injectable } from '@angular/core';
import { EntitySelectStore } from './entity-select.store';
import { EntitySelectService } from 'src/app/common/services';
import {
  AdvEntitySearchableGroupListModel,
  AdvEntitySelectableGroupModel,
  OperationDataResult,
  Paged,
} from 'src/app/common/models';
import { Observable } from 'rxjs';
import { EntitySelectQuery } from 'src/app/modules/advanced/components/entity-select/state/entity-select.query';
import { updateTablePage, updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';

@Injectable({ providedIn: 'root' })
export class EntitySelectStateService {
  constructor(
    private store: EntitySelectStore,
    private service: EntitySelectService,
    private query: EntitySelectQuery
  ) {}

  getEntitySelectableGroupList(): Observable<
    OperationDataResult<Paged<AdvEntitySelectableGroupModel>>
  > {
    return this.service.getEntitySelectableGroupList({
      isSortDsc: this.query.pageSetting.isSortDsc,
      nameFilter: this.query.pageSetting.nameFilter,
      offset: this.query.pageSetting.offset,
      pageSize: this.query.pageSetting.pageSize,
      sort: this.query.pageSetting.sort,
      pageIndex: 0,
    });
  }

  updateNameFilter(nameFilter: string) {
    this.store.update({ nameFilter: nameFilter });
  }

  updateSort(sort: string) {
    this.store.update({ sort: sort });
  }

  updateIsSortDsc(isSortDsc: boolean) {
    this.store.update({ isSortDsc: isSortDsc });
  }

  updatePageSize(pageSize: number) {
    this.store.update({ pageSize: pageSize });
  }

  updateOffset(offset: number) {
    this.store.update({ offset: offset });
  }

  getOffset(): Observable<number> {
    return this.query.selectOffset$;
  }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  getSort(): Observable<string> {
    return this.query.selectSort$;
  }

  getIsSortDsc(): Observable<boolean> {
    return this.query.selectIsSortDsc$;
  }

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }

  changePage(offset: number) {
    const updatedPageSetting = updateTablePage(offset, {
      offset: this.query.pageSetting.offset,
      pageSize: this.query.pageSetting.pageSize,
      isSortDsc: false,
      sort: '',
      pageIndex: 0,
    });
    this.store.update({ offset: updatedPageSetting.offset });
  }

  onDelete(total) {
    const newOffset = getOffset(
      this.query.pageSetting.pageSize,
      this.query.pageSetting.offset,
      total
    );
    if (newOffset !== this.query.pageSetting.offset) {
      this.store.update({ offset: newOffset });
    }
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.sort,
      this.query.pageSetting.isSortDsc
    );
    this.store.update({
      isSortDsc: localPageSettings.isSortDsc,
      sort: localPageSettings.sort,
    });
  }
}
