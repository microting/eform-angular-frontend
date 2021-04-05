import { Injectable } from '@angular/core';
import { CasesStore } from './cases-store';
import { CasesService } from 'src/app/common/services';
import { Observable } from 'rxjs';
import {
  CaseListModel,
  OperationDataResult,
  TemplateDto,
} from 'src/app/common/models';
import { updateTablePage, updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { CasesQuery } from 'src/app/modules/cases/components/state/cases-query';
import { EFormService } from 'src/app/common/services/eform';

@Injectable({ providedIn: 'root' })
export class CasesStateService {
  constructor(
    private store: CasesStore,
    private service: CasesService,
    private query: CasesQuery,
    private eFormService: EFormService
  ) {}

  private total: number;
  private templateId: number;

  loadTemplateData(): Observable<OperationDataResult<TemplateDto>> {
    return this.eFormService.getSingle(this.templateId);
  }

  getCases(): Observable<OperationDataResult<CaseListModel>> {
    return this.service
      .getCases({
        isSortDsc: this.query.pageSetting.isSortDsc,
        nameFilter: this.query.pageSetting.nameFilter,
        offset: this.query.pageSetting.offset,
        pageSize: this.query.pageSetting.pageSize,
        sort: this.query.pageSetting.sort,
        templateId: this.templateId,
        pageIndex: this.query.pageSetting.pageIndex,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.total = response.model.numOfElements;
          }
          return response;
        })
      );
  }

  setTemplateId(templateId: number) {
    this.templateId = templateId;
  }

  updateNameFilter(nameFilter: string) {
    this.store.update({ nameFilter: nameFilter, pageIndex: 0, offset: 0 });
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

  changePage(offset: number) {
    const updatedPageSetting = updateTablePage(offset, {
      offset: this.query.pageSetting.offset,
      pageSize: this.query.pageSetting.pageSize,
      isSortDsc: false,
      sort: '',
      pageIndex: this.query.pageSetting.pageIndex,
    });
    this.store.update({
      offset: offset,
      pageIndex: updatedPageSetting.pageIndex,
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
        pageIndex: Math.ceil(this.query.pageSetting.pageSize / newOffset),
      });
    }
  }
}
