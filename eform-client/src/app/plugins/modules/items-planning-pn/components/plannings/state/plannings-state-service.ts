import { Injectable } from '@angular/core';
import { PlanningsStore } from './plannings-store';
import { Observable } from 'rxjs';
import { OperationDataResult, Paged } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { PlanningModel } from 'src/app/plugins/modules/items-planning-pn/models/plannings';
import { PlanningsQuery } from './plannings-query';
import { ItemsPlanningPnPlanningsService } from 'src/app/plugins/modules/items-planning-pn/services';
import { arrayAdd, arrayRemove } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class PlanningsStateService {
  constructor(
    private store: PlanningsStore,
    private service: ItemsPlanningPnPlanningsService,
    private query: PlanningsQuery
  ) {}

  private total: number;

  getAllPlannings(): Observable<OperationDataResult<Paged<PlanningModel>>> {
    return this.service
      .getAllPlannings({
        isSortDsc: this.query.pageSetting.isSortDsc,
        offset: this.query.pageSetting.offset,
        pageSize: this.query.pageSetting.pageSize,
        sort: this.query.pageSetting.sort,
        descriptionFilter: this.query.pageSetting.descriptionFilter,
        tagIds: this.query.pageSetting.tagIds,
        nameFilter: this.query.pageSetting.nameFilter,
        pageIndex: 0,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.total = response.model.total;
          }
          return response;
        })
      );
  }

  updateNameFilter(nameFilter: string) {
    this.store.update({ nameFilter: nameFilter, offset: 0 });
  }

  updatePageSize(pageSize: number) {
    this.store.update({ pageSize: pageSize });
    this.checkOffset();
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

  getDescriptionFilter(): Observable<string> {
    return this.query.selectDescriptionFilter$;
  }

  getTagIds(): Observable<number[]> {
    return this.query.selectTagIds$;
  }

  addTagId(id: number) {
    this.store.update(({ tagIds }) => ({
      tagIds: arrayAdd(tagIds, id),
    }));
  }

  removeTagId(id: number) {
    this.store.update(({ tagIds }) => ({
      tagIds: arrayRemove(tagIds, id),
    }));
  }

  changePage(offset: number) {
    this.store.update({
      offset: offset,
    });
  }

  onDelete() {
    this.total -= 1;
    this.checkOffset();
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

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pageSize,
      this.query.pageSetting.offset,
      this.total
    );
    if (newOffset !== this.query.pageSetting.offset) {
      this.store.update({
        offset: newOffset,
      });
    }
  }

  updateDescriptionFilter(newDescriptionFilter: string) {
    this.store.update({ descriptionFilter: newDescriptionFilter });
  }
}
