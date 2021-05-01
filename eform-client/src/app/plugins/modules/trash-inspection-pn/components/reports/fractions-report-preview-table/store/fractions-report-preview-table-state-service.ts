import { Injectable } from '@angular/core';
import { FractionsReportPreviewTableStore } from './fractions-report-preview-table-store';
import { Observable } from 'rxjs';
import { OperationDataResult, Paged } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { FractionsReportPreviewTableQuery } from './fractions-report-preview-table-query';
import { TrashInspectionPnFractionsService } from '../../../../services';
import { FractionPnStatsByYearModel } from '../../../../models';

@Injectable({ providedIn: 'root' })
export class FractionsReportPreviewTableStateService {
  constructor(
    private store: FractionsReportPreviewTableStore,
    private service: TrashInspectionPnFractionsService,
    private query: FractionsReportPreviewTableQuery
  ) {}

  private year = new Date().getFullYear();

  getAllFractionsStatsByYear(): Observable<
    OperationDataResult<Paged<FractionPnStatsByYearModel>>
  > {
    return this.service.getAllFractionsStatsByYear({
      isSortDsc: this.query.pageSetting.pagination.isSortDsc,
      sort: this.query.pageSetting.pagination.sort,
      year: this.year,
    });
  }

  updateYear(year: number) {
    this.year = year;
  }

  getSort(): Observable<string> {
    return this.query.selectSort$;
  }

  getIsSortDsc(): Observable<boolean> {
    return this.query.selectIsSortDsc$;
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
}
