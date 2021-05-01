import { Injectable } from '@angular/core';
import { ProducersReportPreviewTableStore } from './producers-report-preview-table-store';
import { Observable } from 'rxjs';
import { OperationDataResult, Paged } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { ProducersReportPreviewTableQuery } from './producers-report-preview-table-query';
import { TrashInspectionPnProducersService } from '../../../../services';
import { ProducerPnStatsByYearModel } from '../../../../models';

@Injectable({ providedIn: 'root' })
export class ProducersReportPreviewTableStateService {
  constructor(
    private store: ProducersReportPreviewTableStore,
    private service: TrashInspectionPnProducersService,
    private query: ProducersReportPreviewTableQuery
  ) {}

  private year = new Date().getFullYear();

  getAllProducersStatsByYear(): Observable<
    OperationDataResult<Paged<ProducerPnStatsByYearModel>>
  > {
    return this.service.getAllProducersStatsByYear({
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
